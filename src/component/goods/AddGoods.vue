<template>
  <div>
    <!-- 面包屑区域 -->
    <breadCrumb :info="info" />

    <!-- 卡片布局区域 -->
    <el-card>
      <!-- 消息提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 进度条区域 -->
      <el-steps
        :space="200"
        :active="activeStep - 0"
        finish-status="success"
        :align-center="true"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeStep"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                :options="cate"
                clearable
                v-model="addForm.goods_cat"
                :props="props"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1" >
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyDataList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals" size="small">
                <el-checkbox
                  :label="itemChild"
                  v-for="(itemChild, index) in item.attr_vals"
                  :key="index"
                  @change="changeCheckbox(item)"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyDataList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 图片上传的API接口地址 -->
            <!-- list-type 指定上传文件的显示方式 -->
            <!-- 由于el-upload 本身封装了异步上传的方法，没有设置请求头部的token值，
            所以需要手动给el-upload组件，添加请求头 -->
            <el-upload
              class="upload-demo"
              :action="UploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewURL" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import breadCrumb from '@/component/subcomponent/breadCrumb.vue'
export default {
  props: {},
  data () {
    return {
      info: ['商品管理', '添加商品'],
      // 当前步骤
      activeStep: '0',
      // 商品信息
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        // 图片数组
        pics: [],
        // 富文本内容
        goods_introduce: '',
        // 商品参数数组
        attrs: []
      },
      // 校验规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '分类不能为空', trigger: 'blur' }
        ]
      },
      // 商品分类数组
      cate: [],
      // 级联选择器配置参数设置
      props: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表
      manyDataList: [],
      // 静态属性列表
      onlyDataList: [],
      UploadURL: 'https://www.liulongbin.top:8888/api/private/v1/upload',
      // 请求头
      headersObj: {
        Authorization: sessionStorage.getItem('token')
      },
      // 控制图片预览弹框显示
      previewDialogVisible: false,
      // 预览图片地址
      previewURL: ''
    }
  },
  created () {
    this.getGoodsCate()
  },
  methods: {
    // 获取商品分类数据
    async getGoodsCate () {
      const { data: res } = await this.$http.get('categories')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.cate = res.data
    },
    // 级联选择器改变事件
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      this.addForm.goods_cat = this.addForm.goods_cat.join(',')
    },
    // 标签页切换之前钩子函数
    beforeTabLeave (activeName, oldActiveName) {
      if (
        this.addForm.goods_cat.length === 0 ||
        this.addForm.goods_name === ''
      ) {
        this.$msg.error('请先输入商品分类和商品名称')
        return false
      }
      return true
    },
    // 标签页点击事件
    async tabClick () {
      // 从 goods_cat 字符串中提取 分类id
      if (this.addForm.goods_cat.length === 0) {
        // this.manyDataList = []
        return
      }
      const temp = this.addForm.goods_cat.split(',')
      const catID = temp[temp.length - 1]
      let sel = 'many'
      if (this.activeStep === '1') {
        sel = 'many'
      } else if (this.activeStep === '2') {
        sel = 'only'
      }
      const { data: res } = await this.$http.get(
        `categories/${catID}/attributes`,
        {
          params: {
            sel: sel
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      if (sel === 'many') {
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyDataList = res.data
      } else {
        this.onlyDataList = res.data
      }
    },
    // 图片 预览 事件
    handlePreview (file) {
      this.previewURL = file.response.data.url
      this.previewDialogVisible = true
    },
    // 图片移除事件
    handleRemove (file) {
      // 将图片从数组中删除
      const tmpPath = file.response.data.tmp_path
      this.addForm.pics.forEach((item, i) => {
        if (item.pic === tmpPath) {
          this.addForm.pics.splice(i, 1)
        }
      })
    },
    // 监听图片上传成功
    handleSuccess (resp) {
      const tmpPath = { pic: resp.data.tmp_path }
      this.addForm.pics.push(tmpPath)
    },
    // 添加商品事件
    addGoods () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$msg.error('请将信息输入完整')
        }
        // 将动态参数添加到商品参数数组中
        this.manyDataList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 将静态属性添加到商品参数数组中
        this.onlyDataList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        // 将这三个变量的值转换成数字类型
        this.addForm.goods_price = +this.addForm.goods_price
        this.addForm.goods_weight = +this.addForm.goods_weight
        this.addForm.goods_number = +this.addForm.goods_number
        const { data: res } = await this.$http.post('goods', this.addForm)
        if (res.meta.status !== 201) {
          if (res.meta.msg === '创建商品基本信息失败') {
            return this.$msg.error('商品名称重复，请重新添加')
          }
          return this.$msg.error(res.meta.msg)
        }
        this.$msg.success(res.meta.msg)
        this.$router.push('/goods')
      })
    },
    // 参数列表更新事件
    async changeCheckbox (param) {
      // console.log(param.attr_sel)
      // const { data: res } = await this.$http.put(`categories/${param.cat_id}/attributes/${param.attr_id}`, {
      //   attr_name: param.attr_name,
      //   attr_sel: 'many',
      //   attr_vals: param.attr_vals
      // })
      // if (res.meta.status !== 200) {
      //   return this.$msg.error(res.meta.msg)
      // }
      // this.$msg.success(res.meta.msg)
    }
  },
  components: {
    breadCrumb
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 20px;
}
.el-tabs {
  margin-top: 30px;
}

.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.el-button {
  margin-top: 20px;
}
</style>
