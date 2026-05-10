import { Company } from '../../model/company';
const categories = require('../../data/categories.js');

const REQUIRED_FIELDS = ['name', 'type', 'province', 'source'];

Page({
  data: {
    // 类型选项
    typeOptions: categories,

    // 表单字段
    form: {
      name: '',
      type: '',
      province: '',
      city: '',
      district: '',
      address: '',
      source: '',
      remark: ''
    },

    // 选中的省/市/区数组（picker mode=region 用）
    region: [],
    regionText: '',

    // 字符计数
    remarkLen: 0,
    sourceLen: 0,

    // 校验错误（字段名 -> 错误提示文案）
    errors: {},

    // 同意条款
    agreed: false,

    // 预览弹窗
    showPreview: false
  },

  onLoad() {
    // 尝试恢复草稿（可选，用户上次未提交内容）
    // 这里仅做最小实现，不持久化
  },

  // ============ 字段绑定 ============

  bindName(e) {
    this._setField('name', (e.detail.value || '').trim());
  },
  bindAddress(e) {
    this._setField('address', e.detail.value || '');
  },
  bindSource(e) {
    const v = e.detail.value || '';
    this._setField('source', v.trim());
    this.setData({ sourceLen: v.length });
  },
  bindRemark(e) {
    const v = e.detail.value || '';
    this._setField('remark', v);
    this.setData({ remarkLen: v.length });
  },

  // 类型 radio
  onTypeChange(e) {
    // lin-ui radio-group 触发 linchange 时 detail 是 { key, ... }
    const v = (e.detail && (e.detail.key || e.detail.currentKey)) || '';
    this._setField('type', v);
  },

  // 省市区 picker
  onRegionChange(e) {
    const arr = e.detail.value || [];
    const [province = '', city = '', district = ''] = arr;
    this.setData({
      region: arr,
      regionText: arr.filter(Boolean).join(' / '),
      'form.province': province,
      'form.city': city,
      'form.district': district
    });
    // 清除 province 错误
    if (this.data.errors.province && province) {
      const errors = { ...this.data.errors };
      delete errors.province;
      this.setData({ errors });
    }
  },

  // 内部：设置字段并清错
  _setField(key, val) {
    this.setData({ [`form.${key}`]: val });
    if (this.data.errors[key] && val) {
      const errors = { ...this.data.errors };
      delete errors[key];
      this.setData({ errors });
    }
  },

  // ============ 同意条款 ============

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },
  goNotice() {
    wx.navigateTo({ url: '/pages/notice/notice' });
  },
  goPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' });
  },

  // ============ 校验 ============

  _validate() {
    const errors = {};
    const f = this.data.form;
    if (!f.name) errors.name = '请填写公司/机构名称';
    if (!f.type) errors.type = '请选择类型';
    if (!f.province) errors.province = '请选择省/市/区';
    if (!f.source) errors.source = '请填写信源（裁判文书号 / 公告链接 / 媒体报道 URL）';
    this.setData({ errors });
    return Object.keys(errors).length === 0;
  },

  // ============ 预览 ============

  openPreview() {
    if (!this._validate()) {
      wx.lin.showToast({ title: '请先完善必填项', icon: 'error' });
      return;
    }
    if (!this.data.agreed) {
      wx.lin.showToast({
        title: '请先勾选同意《投稿须知》与《隐私政策》',
        icon: 'error'
      });
      return;
    }
    this.setData({ showPreview: true });
  },

  closePreview() {
    this.setData({ showPreview: false });
  },

  // ============ 提交 ============

  async confirmSubmit() {
    this.setData({ showPreview: false });
    const payload = { ...this.data.form };
    const res = await Company.addCompanyInfo(payload);
    if (res && res.code === 500) {
      wx.lin.showToast({ title: '已有相同记录，无需重复提交', icon: 'error' });
      return;
    }
    if (res && res.code === 0) {
      wx.lin.showToast({ title: '提交成功，等待审核', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1200);
    }
  }
});
