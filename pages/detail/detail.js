// pages/detail/detail.js
import { Company } from "../../model/company";
import { withPrivacy } from "../../utils/privacy";

Page(withPrivacy({
  data: {
    company: null,
    activeTab: 0,    // 0=基本信息  1=薪资  2=点评
    activeKey: '0', // l-segment 需要字符串 key
    salary: { total: 0 },
    review: { total: 0 },
    // 隐私授权字段（showPrivacy / privacyContractName）由 withPrivacy 注入
    // 默认匿名头像（当找不到匹配时作为备用）
    defaultAvatar: '/imgs/avatar/1.png',
    // l-rate 的五角星图标（lin-ui 自带图标为爱心）
    starActive: 'https://img.icons8.com/fluency/48/star.png',
    starInactive: 'https://img.icons8.com/material-outlined/48/cccccc/star--v1.png'
  },

  async onLoad(options) {
    this.registerPrivacyListener();
    const id = options && options.id;
    if (!id) {
      wx.showToast({ title: '缺少参数 id', icon: 'none' });
      return;
    }
    const company = await Company.getById(id);
    if (!company) {
      wx.showToast({ title: '未找到该公司', icon: 'none' });
      return;
    }
    wx.setNavigationBarTitle({ title: company.name });

    this.setData({
      company,
      salary: this._buildSalary(company),
      review: this._buildReview(company)
    });
  },

  // l-segment 切换
  onTabChange(e) {
    // l-segment 的 linchange 事件 detail: { activeKey, currentIndex }
    const d = e && e.detail || {};
    const idx = d.currentIndex !== undefined ? d.currentIndex
              : d.activeKey !== undefined    ? d.activeKey
              : d.index;
    const n = Number(idx);
    const safeN = isNaN(n) ? 0 : n;
    this.setData({
      activeTab: safeN,
      activeKey: String(safeN)
    });
  },

  // 复制信用代码（需隐私授权后才可调用剪贴板 API）
  copyCode() {
    const code = this.data.company && this.data.company.socialCreditCode;
    if (!code) return;
    const doCopy = () => {
      wx.setClipboardData({
        data: code,
        success: () => {
          wx.showToast({ title: '复制成功', icon: 'success' });
        }
      });
    };
    if (wx.requirePrivacyAuthorize) {
      wx.requirePrivacyAuthorize({
        success: doCopy,
        fail: () => {
          wx.showToast({ title: '需要同意隐私政策后才能复制', icon: 'none' });
        }
      });
    } else {
      doCopy();
    }
  },

  // —— 隐私授权逻辑由 utils/privacy.js 统一提供 ——

  // 申诉入口
  goAppeal() {
    wx.navigateTo({ url: '/pages/appeal/appeal' });
  },

  // 爆料薪资
  goContributeSalary() {
    wx.navigateTo({ url: '/pages/contribute/contribute?type=salary&companyId=' + (this.data.company && this.data.company.id || '') });
  },

  // 写点评
  goContributeReview() {
    wx.navigateTo({ url: '/pages/contribute/contribute?type=review&companyId=' + (this.data.company && this.data.company.id || '') });
  },

  // 展开/收起点评
  toggleReviewExpand(e) {
    const index = e.currentTarget.dataset.index;
    const key = `review.list[${index}].expanded`;
    const current = this.data.review.list[index].expanded;
    this.setData({
      [key]: !current
    });
  },

  /**
   * 薪资视图模型
   * 数据来源优先级：company.salaries（用户爆料数组） > 空态
   * 单条 salary 字段约定：{ id, title, amount, workYear, city, date, extra }
   */
  _buildSalary(company) {
    const list = (company && company.salaries) || [];
    if (!list.length) return { total: 0 };

    const amounts = list.map(s => Number(s.amount) || 0).filter(n => n > 0);
    const sum = amounts.reduce((a, b) => a + b, 0);
    const avg = amounts.length ? Math.round(sum / amounts.length) : 0;
    const min = amounts.length ? Math.min.apply(null, amounts) : 0;
    const max = amounts.length ? Math.max.apply(null, amounts) : 0;

    let avgPercent = 50;
    if (min !== max) {
      avgPercent = Math.round(((avg - min) / (max - min)) * 100);
    }

    // 按岗位聚合
    const jobMap = {};
    list.forEach(s => {
      const t = s.title || '其他岗位';
      if (!jobMap[t]) jobMap[t] = { title: t, count: 0, sum: 0 };
      jobMap[t].count += 1;
      jobMap[t].sum += Number(s.amount) || 0;
    });
    const byJob = Object.keys(jobMap).map(k => ({
      title: jobMap[k].title,
      count: jobMap[k].count,
      avg: jobMap[k].count ? Math.round(jobMap[k].sum / jobMap[k].count) : 0
    })).sort((a, b) => b.count - a.count);

    // 按时间倒序，最多展示 5 条
    const sortedList = list.slice().sort((a, b) => {
      return (b.date || '').localeCompare(a.date || '');
    }).slice(0, 5);

    return {
      total: list.length,
      avg, min, max, avgPercent,
      byJob,
      list: sortedList
    };
  },

  /**
   * 点评视图模型
   * 数据来源：company.reviews 数组
   * 单条字段：{ id, author, position, score(1-5), recommend(bool), content, tags[], workYear, date, dimensions{ salary, growth, culture, workLife } }
   */
  _buildReview(company) {
    const list = (company && company.reviews) || [];
    if (!list.length) return { total: 0 };

    const scores = list.map(r => Number(r.score) || 0);
    const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const recommendCount = list.filter(r => r.recommend).length;
    const recommendRate = list.length ? Math.round(recommendCount / list.length * 100) : 0;

    // 维度聚合（5 分制）
    const dimKeys = [
      { key: 'salary', label: '薪酬福利' },
      { key: 'growth', label: '成长空间' },
      { key: 'culture', label: '企业文化' },
      { key: 'workLife', label: '工作强度' }
    ];
    const dimensions = dimKeys.map(d => {
      const arr = list.map(r => r.dimensions && Number(r.dimensions[d.key])).filter(n => n > 0);
      const s = arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
      return {
        label: d.label,
        score: s.toFixed(1),
        percent: Math.round(s / 5 * 100)
      };
    });

    const sortedList = list.slice().sort((a, b) => {
      return (b.date || '').localeCompare(a.date || '');
    }).slice(0, 10).map((r, index) => {
      if (!r.avatar) {
        // 使用简单的长度/字符计算分配 1-5 对应的本地随机头像
        const str = r.author || (r.id ? String(r.id) : String(index));
        let num = 0;
        for (let i = 0; i < str.length; i++) {
          num += str.charCodeAt(i);
        }
        const avatarId = (num % 5) + 1;
        r.avatar = `/imgs/avatar/${avatarId}.png`;
      }
      return r;
    });

    return {
      total: list.length,
      avg: avg.toFixed(1),
      avgInt: Math.round(avg),
      recommendRate,
      dimensions,
      list: sortedList
    };
  }
}))
