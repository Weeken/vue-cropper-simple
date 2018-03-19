<template lang="html">
  <div class="v-cropper-bg-mask">
      <div class="v-cropper" ref="wrap" :style="scaleStyle">
        <span class="v-cropper-close" @click="close"></span>
        <div class="v-cropper-top">
          <div class="v-cropper-label">裁剪区</div>
          <div class="v-cropper-container">
            <div class="v-cropper-mask" v-if="confirm"></div>
            <img :src="img" alt="" ref="image"/>
          </div>
        </div>
        <div class="v-cropper-bottom">
          <div class="v-cropper-left">
            <div class="v-cropper-label">预览</div>
            <div class="v-cropper-preview"></div>
          </div>
          <div class="v-cropper-right">
            <div class="v-cropper-label">数据</div>
            <div class="v-cropper-label">长 x 宽：{{naturalWidth}} x {{naturalHeight}}</div>
            <div class="v-cropper-data">
              <input class="v-cropper-input" type="text" v-model="imageDataStr" placeholder="裁剪数据">
              <div class="v-cropper-button">
                <button class="v-cropper-crop" @click="getCropBoxData">裁剪</button>
                <button class="v-cropper-cancel" @click="resetCropBoxData">撤销</button>
                <button class="v-cropper-submit" @click="submit" :disabled="!confirm">提交</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div class="v-cropper-range-wrap">
      <input class="v-cropper-range" type="range" v-model="range" min="20" max="100" step="10" ref="range" :style="widthStyle">
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import './css/range.css'
export default {
  name: 'VueCropper',
  props: {
    img: {
      type: String,
      required: true
    },
    ratio: Number
  },
  data () {
    return {
      range: 60,
      widthStyle: { width: 0 },
      scaleStyle: { transform: 'translate(-50%, -50%) scale(1)' },
      naturalWidth: '',
      naturalHeight: '',
      cropper: {},
      confirm: false,
      scale: 1,
      imageDataStr: '',
      imageData: {},
      croppedImg: ''
    }
  },
  watch: {
    range (val) {
      this.scaleStyle.transform = `translate(-50%, -50%) scale(${val/60})`
    }
  },
  methods: {
    init () {
      let croperBg = document.querySelector('.cropper-container')
      let container = document.querySelector('.v-cropper-container')

      this.naturalWidth = this.cropper.initialImageData.naturalWidth
      this.naturalHeight = this.cropper.initialImageData.naturalHeight

      this.scale = this.naturalWidth / 500

      let height = parseInt(this.naturalHeight / this.scale)
      container.style.height = height + 'px'
      croperBg.style.height = height + 'px'
      //
      let data = { left: 0, top: 0, width: 500, height: height }
      this.cropper.containerData.height = height
      this.cropper.cropBoxData.maxWidth = 500
      this.cropper.cropBoxData.maxHeight = height
      this.cropper.setCanvasData(data)

      // range
      this.widthStyle.width = this.$refs.wrap.offsetHeight + 'px'
    },
    getCropBoxData () {
      let data = this.cropper.getCropBoxData()
      this.imageData.x = parseInt(data.left * this.scale)
      this.imageData.y = parseInt(data.top * this.scale)
      this.imageData.w = parseInt(data.width * this.scale)
      this.imageData.h = parseInt(data.height * this.scale)
      this.imageDataStr = JSON.stringify(this.imageData)
      this.croppedImg = this.cropper.getCroppedCanvas(this.imageData).toDataURL()
      this.confirm = true
    },
    resetCropBoxData () {
      this.imageDataStr = ''
      this.croppedImg = ''
      this.confirm = false
    },
    submit () {
      this.$emit('update:result', this.croppedImg)
      this.$emit('update:imgData', this.imageData)
      this.close()
    },
    close () {
      this.resetCropBoxData()
      this.$emit('close')
    }
  },
  computed: {
    image () {
      return this.$refs.image
    }
  },
  mounted () {
    const that = this
    that.cropper = new Cropper(that.image, {
      dragMode: 'crop',
      scalable: false,
      zoomable: false,
      aspectRatio: this.ratio,
      preview: '.v-cropper-preview',
      viewMode: 3,
      crop (e) {},
      ready () {
        that.init()
      }
    })
  }
}
</script>

<style lang="css">
  .v-cropper-bg-mask{
    position: fixed;
    z-index: 100000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.3);
  }

  .v-cropper-range-wrap{
    position: fixed;
    top: 0;
    right: 6%;
    bottom: 0;
    width: 4px;
    z-index: 999999999999;
  }

  .v-cropper{
    position: fixed;
    z-index: 100001;
    top: 50%;
    left: 52%;
    transform: translate(-50%, -50%);
    width: 520px;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 0 14px rgba(0,0,0,.4);
  }

  .v-cropper-close{
    position: inherit;
    width: 20px;
    height: 20px;
    top: 10px;
    right: 10px;
    cursor: pointer;
    background: url('./images/icn-close.png') no-repeat;
    background-size: cover;
    transition: all .3s linear;
  }
  .v-cropper-close:hover{
    transform: rotate(180deg);
  }
  .v-cropper-container{
    position: relative;
    width: 100%;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .v-cropper-container img {
    max-width: 100%;
  }
  .v-cropper-mask{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
  }
  .v-cropper-bottom{
    width: 100%;
    min-height: 150px;
  }
  .v-cropper-bottom:after{
    content: "";
    display: block;
    width: 0;
    height: 0;
    clear: both;
  }
  .v-cropper-left{
    float: left;
    width: 50%;
    padding-right: 10px;
  }
  .v-cropper-label{
    font: 14px/24px sinsum;
  }
  .v-cropper-preview{
    width: 200px;
    height: 120px;
    border: 1px solid #ddd;
    overflow: hidden;
  }
  .v-cropper-right{
    float: left;
    width: 50%;
  }
  .v-cropper-data{
    width: 100%;
  }
  .v-cropper-input{
    display: block;
    width: 100%;
    height: 36px;
    padding: 0 10px;
    font-size: 14px;
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .v-cropper-input::-webkit-input-placeholder { color: #b2b2b2; font-size: 14px; }
  .v-cropper-input:-moz-placeholder { color: #b2b2b2; font-size: 14px; }
  .v-cropper-input::-moz-placeholder { color: #b2b2b2; font-size: 14px; }
  .v-cropper-input:-ms-input-placeholder { color: #b2b2b2; font-size: 14px;}
  .v-cropper-button{
    margin: 10px 0 15px;
  }
  .v-cropper-button > button{
    position: relative;
    cursor: pointer;
    min-width: 60px;
    padding: 0 10px;
    height: 30px;
    margin-right: 10px;
    border-radius: 4px;
    outline: none;
  }
  .v-cropper-button > button:after{
    content: '';
    position: absolute;
    top: 70%;
    left: 50%;
    z-index: -5;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 50%;
    border-radius: 5px;
  }
  .v-cropper-crop{
    border: 1px solid #39f;
    color: #fff;
    background-color: #39f;
  }
  .v-cropper-crop:after{
    background-color: rgba(51,153,255,.4);
    box-shadow: 0 6px 14px rgba(51,153,255,.4);
  }
  .v-cropper-crop:hover{
    background-color: #2487ea;
    border: 1px solid #2487ea;
  }
  .v-cropper-crop:hover:after{
    background-color: rgba(51,153,255,0);
    box-shadow: 0 6px 14px rgba(51,153,255,0);
  }
  .v-cropper-cancel{
    color: #fff;
    background-color: #dcdcdc;
    border: 1px solid #dcdcdc;
  }
  .v-cropper-cancel:hover{
    background-color: #ccc;
    border: 1px solid #ccc;
  }
  .v-cropper-cancel:after{
    background-color: rgba(204,204,204,.6);
    box-shadow: 0 6px 14px rgba(204,204,204,.6);
  }
  .v-cropper-cancel:hover:after{
    background-color: rgba(204,204,204,0);
    box-shadow: 0 6px 14px rgba(204,204,204,0);
  }
  .v-cropper-submit{
    color: #fff;
    background-color: #f23030;
    border: 1px solid #f23030;
  }
  .v-cropper-submit[disabled="disabled"]{
    cursor: not-allowed;
  }
  .v-cropper-submit:hover{
    background-color: #cd3219;
    border: 1px solid #cd3219;
  }
  .v-cropper-submit:after{
    background-color: rgba(242,48,48,.4);
    box-shadow: 0 6px 14px rgba(242,48,48,.4);
  }
  .v-cropper-submit:hover:after{
    background-color: rgba(242,48,48,0);
    box-shadow: 0 6px 14px rgba(242,48,48,0);
  }
</style>
