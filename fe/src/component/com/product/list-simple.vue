<template>
  <el-table :data="data" :fit="true" border>
    <el-table-column :label="__('productName')" min-width="150">
      <template slot-scope="scope">
        {{scope.row.product.name}}
      </template>
    </el-table-column>
    <el-table-column :label="__('productCategory')" min-width="150">
      <template slot-scope="scope">
        /
      </template>
    </el-table-column>
    <el-table-column label="资源&位置" min-width="150">
      <template slot-scope="scope">
        /
      </template>
    </el-table-column>
    <el-table-column label="支持价格" min-width="150">
      <template slot-scope="scope">
        /
      </template>
    </el-table-column>
    <el-table-column label="组合数量" min-width="150">
      <template slot-scope="scope">
        /
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'com-product-list-simple',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
}
</script>
