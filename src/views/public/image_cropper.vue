<template>
  <el-dialog title="图片裁剪" width="600px" :visible.sync="visible" :close-on-press-escape="false"
             :close-on-click-modal="false" :before-close="handleClose">
    <el-row>
      <el-col :span="24">
        <div style="height: 400px">
          <VueCropper
            ref="cropper"
            :img="config.img"
            :outputSize="config.size"
            :outputType="config.outputType"
            :info="true"
            :full="config.full"
            :canMove="config.canMove"
            :canMoveBox="config.canMoveBox"
            :fixedBox="config.fixedBox"
            :original="config.original"
            :autoCrop="config.autoCrop"
            :autoCropWidth="config.autoCropWidth"
            :autoCropHeight="config.autoCropHeight"
            :centerBox="config.centerBox"
            :high="config.high"
            :infoTrue="config.infoTrue"
            :maxImgSize="config.maxImgSize"
            :enlarge="config.enlarge"
            :mode="config.mode"
            :limitMinSize="config.limitMinSize"
          >
          </VueCropper>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col>
        <el-upload style="display: inline-block" :accept="config.accept" :action="upload.action" :show-file-list="false"
                   :limit=1 ref="upload" :auto-upload="true" :before-upload="chooseFile">
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
        <el-button type="primary" :disabled="!hasChooseFile" size="small" icon="el-icon-refresh-left"
                   @click="rotateLeft" style="margin-left: 10px"></el-button>
        <el-button type="primary" :disabled="!hasChooseFile" size="small" icon="el-icon-refresh-right"
                   @click="rotateRight"></el-button>
        <el-button type="primary" :disabled="!hasChooseFile" size="small" @click="refreshCrop">还源</el-button>
        <el-button type="primary" :disabled="!hasChooseFile" size="small" @click="finish">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {VueCropper} from "vue-cropper"

export default {
  name: "image_cropper",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    option: {
      type: Object,
      default: {},
    },
    uploadSuccess: {
      type: Function,
      default: function (url) {
      }
    }
  },
  components: {
    VueCropper,
  },
  data() {
    return {
      imageData: null,
      config: {
        img: "",
        size: 1,
        full: false,
        outputType: "png",
        infoTrue: false,
        canMove: true,
        fixedBox: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 200,
        autoCropHeight: 150,
        centerBox: false,
        high: false,
        enlarge: 1,
        mode: 'contain',
        maxImgSize: 3000,
        limitMinSize: [100, 120],
        accept: ".jpeg,.gif,.png,.bmp,.jpg",
        businessIdentity: 'cropper',
        sizeLimit: 1048576,
      },
      upload: {
        action: 'http://up-z1.qiniu.com',
        accessPrefix: 'http://doc.yctop.com/',
        token: '',
        //文件唯一标识
        key: '',
        file: null
      },
      accessUrl: '',
      hasChooseFile: false,

    }
  },
  methods: {

    openSuccess(msg) {
      this.$notify({
        title: '',
        message: msg || '操作成功',
        type: 'success',
        position: 'bottom-right'
      });
    },
    openError(info) {
      this.$notify({
        title: '',
        message: '操作失败，' + info,
        type: 'error',
        position: 'bottom-right'
      });
    },
    handleClose() {
      this.$emit('update:visible', false);
    },
    chooseFile(file) {
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(file.name)) {
        this.openError("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      if (file.size > this.config.sizeLimit) {
        this.openError("图片大小不能超过1M");
        return
      }
      let reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.config.img = data;
        this.hasChooseFile = true;
      };
      // 转化为blob
      reader.readAsArrayBuffer(file);

      return false;
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    finish() {
      if (!this.hasChooseFile) {
        this.openError("请先选择文件");
        return
      }
      this.$refs.cropper.getCropBlob(data => {
        this.upload.file = data;
        this.$nextTick(() => {
          this.submitUpload();
        });
      });
    },
    refreshCrop() {
      this.$refs.cropper.refresh();
    },
    loadUpToken() {
      this.$axios.get('/hrs/org/getUpToken')
        .then(function (response) {
          this.upload.token = response.data.data;
        }.bind(this));
    },
    submitUpload() {
      if (!this.upload.file) {
        this.openError("未获取到上传文件");
        return;
      }
      this.upload.key = this.getUploadKey("." + this.config.outputType);
      if ((this.upload.key || '').length == 0) {
        this.openError("文件唯一标识错误")
      }
      if ((this.upload.token || '').length == 0) {
        this.openError("上传参数错误");
      }

      let param = new FormData();
      param.append("token", this.upload.token);
      param.append("key", this.upload.key);
      param.append("file", this.upload.file);

      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }

      this.$axios.postOriginal(this.upload.action, param, config).then(function (response) {
        if (response.status != 200) {
          this.openError(response.statusText);
          return;
        }
        this.accessUrl = this.upload.accessPrefix + response.data.key;
        try {
          this.uploadSuccess(this.accessUrl);
        } catch (e) {
          console.error(e);
        }
        this.openSuccess('上传成功')
        this.handleClose();
      }.bind(this))
        .catch(function (error) {
          this.openError(error || '上传失败，未知错误')
        }.bind(this))

    },
    getUploadKey(fileSuffix) {
      return (this.config.businessIdentity || 'cropper') + "_" + new Date().getTime() + "_" + this.config.autoCropWidth + "x" + this.config.autoCropHeight + fileSuffix;
    }
  },
  created() {
    for (let key in this.option) {
      this.config[key] = this.option[key];
    }
    this.loadUpToken();
  }
}
</script>

<style scoped>

</style>
