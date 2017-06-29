import VueCropper from './src/cropper'

/* istanbul ignore next */
VueCropper.install = function (Vue) {
  Vue.component(VueCropper.name, VueCropper)
}

export default VueCropper
