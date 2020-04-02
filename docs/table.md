# 分页表格

---

> 使用方式
```html

<mw-table ref="MwTable" :load="loadData">
      <el-table-column prop="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="nickName" label="微信昵称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="tel" label="手机号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="content" label="反馈内容" show-overflow-tooltip></el-table-column>
</mw-table>

<script>
    //载入数据
    async loadData({ page, size, condition }) {
      try {
        let res = await this.api.service.suggest_getListByPage({
          page: page,
          perPage: size,
          ...condition
        });
        if (res.code == 0) { 
          let NO = page * size - size + 1;
          res.data.map((value, index) => {
            value["index"] = NO + index;
          });
          return {
            data: res.data,
            total: res.total
          };
        }
      } catch (ex) {
        console.error(ex);
      }
    }
  }
</script>
```

> 源码解析

```html
<template>
  <div ref="table" class="mw-table">
    <el-table
      :data="tb.data"
      border
      stripe
      v-loading="tb.loading"
      size="mini"
      v-bind="$attrs"
      v-on="$listeners"
      :height="100"
    >
      <slot></slot>
    </el-table>
    <div class="pagination-wrap" ref="page">
      <div>
        <slot name="pagination"></slot>
      </div>
      <el-pagination
        background
        @size-change="handleSizeChange"
        :disabled="tb.loading"
        @current-change="handleCurrentChange"
        :current-page="tb.page"
        :page-sizes="[15,30,50,100]"
        :page-size="tb.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tb.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    load: {
      type: Function
    },
    // 是否首次加载
    firstLoad: {
      type: Boolean,
      default: true
    },
    // 初始化查询条件
    condition: {
      type: Object,
      default: null
    }
  },
  inheritAttrs: false,
  data() {
    return {
      tb: {
        condition: {},
        data: [],
        loading: false,
        page: 1,
        size: 15,
        total: 0,
        cancelToken: null
      }
    }
  },
  created() {
    if (this.condition) this.tb.condition = this.condition
    if (this.firstLoad) this._loadData()
  },
  methods: {
    /*********外部可调用方法*************/
    // 刷新当前数据
    refresh() {
      this._loadData()
    },
    // 搜索
    search(condition) {
      this.tb.condition = condition
      this.reload()
    },
    // 重新加载数据
    reload() {
      this.tb.page = 1
      this.tb.data = []
      this.tb.total = 0
      // 如果当前还在请求状态，则会取消当前请求（需要手动配置）
      if (this.tb.cancelToken && this.tb.cancelToken.cancel) {
        this.tb.cancelToken.cancel('取消请求')
        setTimeout(() => {
          this.tb.loading = false
          this._loadData()
        }, 100)
      } else {
        this.tb.loading = false
        this._loadData()
      }
    },
    // 执行操作
    action(func) {
      this.tb.loading = true
      func().then(flags => {
        this.tb.loading = false
        if (flags === 'reload') {
          this.reload()
        } else if (flags === 'refresh') {
          this.refresh()
        }
      }).catch(() => {
        this.tb.loading = false
      })
    },
    /** *******内部私有方法*************/
    handleSizeChange(val) {
      this.tb.size = val
      this.tb.page = 1
      this._loadData()
    },
    handleCurrentChange(val) {
      this.tb.page = val
      this._loadData()
    },
    _loadData() {
      if (this.tb.loading) return
      this.tb.loading = true
      this.tb.cancelToken = this.api.service.cancelTokenSource()
      this.load(this.tb, this.tb.cancelToken.token).then(res => {
        if (res) {
          // 如果页码大于1，而data没有数据，则向前返回一页
          if (this.tb.page > 1 && res.data.length === 0 && res.total >= this.tb.size) {
            this.tb.loading = false
            this.tb.page = this.tb.page - 1
            this._loadData()
            return
          }
          this.tb.data = res.data
          this.tb.total = res.total
        }
      }).finally(() => {
        this.tb.loading = false
        this.tb.cancelToken = null
      })
    }
  }
}
</script>
```