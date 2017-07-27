# vue-cropper-simple


## 介绍--这个是基于**cropperjs**写成的**vue插件**
### 这个插件只单纯裁剪图片，暂时没有上传功能

![图片](https://github.com/Weeken/vue-cropper-simple/blob/master/demo.png)


## How to use

```
npm install vue-cropper-simple --save

```

```
// main.js
import VueCropper from 'vue-cropper-simple'
Vue.use(VueCropper)
```
```
// app.vue
<div>
    <div class="cropper_warp">
      <img :src="result" alt="croppedImg" v-if="result"/>
      <vue-cropper v-if="isShow" :img="imgUrl" :ratio="16/9" :result.sync="result" :imgData.sync="imgData" v-on:close="hide"></vue-cropper>
    </div>
    <button @click="show">裁剪</button>
</div>

  data () {
      return {
        isShow: false,
        imgUrl: './img.jpg',
        result: '',
        imgData: {}
      }
    },
    methods: {
      show () {
        this.isShow = true
      },
      hide () {
        this.isShow = false
      }
    }
  }
```
### 参数
#### :img
给组件传入要裁剪的图片（必传，String）
#### :ratio
给组件传入要裁剪的比例，如 16/9, 1... （可不传， Number)
#### :result.sync
组件提交返回给父组件的裁剪过的图片，是canvas返回的base64数据
#### :imgData.sync
组件提交返回给父组件的裁剪范围以及裁剪位置：
```
{ h: 864, w: 1536, x: 192, y: 117 }
```
#### v-on:close
关闭组件的方法
