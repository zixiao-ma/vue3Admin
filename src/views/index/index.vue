<template>
  <div>
    <el-row :gutter='20' v-permission="'getStatistics1,GET'">
      <el-col :span='6' v-for='item in listOne' :key='item.value'>
        <el-card class='box-card' shadow='hover'>
          <div class='card_header'>
            <span>{{ item.title }}</span>
            <el-tag :type='item.unitColor'>{{ item.unit }}</el-tag>
          </div>
          <h1>{{ item.value }}</h1>
          <div class='card_btm'>
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}</span>
          </div>
        </el-card>

      </el-col>

    </el-row>
    <el-row :gutter='20' style='margin-top: 10px'>
      <el-col :span='3' v-for='item in cardData' :key='item.path'>
        <el-card @click='$router.push(item.path)' shadow='hover' class='smallCard'>
          <div class='grid-content ep-bg-purple' />
          <p>
            <svg-icon :icon='item.icon'></svg-icon>
          </p>
          <p><span>{{ item.title }}</span></p>
        </el-card>
      </el-col>

    </el-row>
    <el-row :gutter='20' style='margin-top: 10px'>
      <el-col :span='12' v-permission="'getStatistics3,GET'">
        <el-card shadow='hover'>
          <div class='card_header'>
            <span>订单统计</span>
            <span>
               <el-check-tag :checked="chartType==='month'" @click="changeChartType('month')" style='margin-right: 8px'>近一个月</el-check-tag>
                  <el-check-tag :checked="chartType==='week'" @click="changeChartType('week')"
                                style='margin-right: 8px'>近一周</el-check-tag>
                  <el-check-tag :checked="chartType==='hour'" @click="changeChartType('hour')"
                                style='margin-right: 8px'>近24小时</el-check-tag>
            </span>
          </div>
          <div id='chartMain' style='width: 600px;height:277px;'></div>
        </el-card>
      </el-col>
      <el-col :span='12' v-permission="'getStatistics2,GET'">
        <el-card class='btmCard' style='margin-bottom: 10px' shadow='hover' v-for='(val,key) in listTwo' :key='key'>
          <div class='card_header'>
            <span>{{ key === 'goods' ? '店铺及商品提示' : '交易提示' }}</span>
            <el-tag effect='plain' type='danger'>{{ key === 'goods' ? '店铺及商品提示' : '交易提示' }}</el-tag>
          </div>
          <div class='card-body'>
            <span v-for='item in val' :key='item' class='spanbox'>
            <h2>{{ item.value }}</h2>
            <div>{{ item.label }}</div>
          </span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import HOMEAPI from '@/api/home'
import { ref } from 'vue'
import { cardData } from '@/views/index/cardData'
import * as echarts from 'echarts'

const chartType = ref('week')
const listOne = ref([])
const listTwo = ref([])
const getListTwo = async () => {
  const res = await HOMEAPI.getStatisticsTwo()
  listTwo.value = res
}
getListTwo()
const getListOne = async () => {
  const res = await HOMEAPI.getStatisticsOne()
  listOne.value = res.panels
}
getListOne()
const getChartData = async () => {
  const res = await HOMEAPI.getChart(chartType.value)
  const myChart = echarts.init(document.getElementById('chartMain'))
  console.log(res)
  myChart.setOption({
    tooltip: {},
    xAxis: {
      data: res.x
    },
    yAxis: {
      data: res.y
    },
    series: [
      {
        name: '销量',
        type: 'bar',
        data: res.y
      }
    ]
  })
}
getChartData()
const changeChartType = type => {
  chartType.value = type
  getChartData()
}

</script>
<style scoped lang='scss'>
.card-body {
  padding: 11px 0 !important;
}

.card_header {
  height: 41px;
  background-color: rgb(249, 250, 251);
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  align-items: center;

}

.smallCard {
  padding-top: 10px;
  box-sizing: border-box;
}

.card_btm {
  height: 55px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  border-top: 1px solid #ddd;
  color: rgb(107, 114, 128);
  font-size: 14px;
}

h1 {
  font-size: 30px;
  font-weight: 700;
  color: rgb(107, 114, 128);
  margin: 15px;
}

p {
  text-align: center;

  line-height: 30px;
  font-size: 20px;

  span {
    font-size: 14px;
  }
}

.btmCard {
  .card-body {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .spanbox {
    display: inline-block;
    width: 118px;
    height: 90px;
    background-color: rgba(229, 231, 235, .3);
    border-radius: 5px;
    text-align: center;
    padding-top: 20px;
    color: rgb(107, 114, 128);

    h2 {
      font-size: 25px;
      margin-bottom: 5px;
    }

    div {
      font-size: 14px;
    }
  }
}
</style>
