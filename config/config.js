const config = {
  apiBaseUrl: 'https://laitou.aiuiot.com/laitou-java/app/',
  /**
   * 数据源开关：
   *   true  → 读取 /data/*.json 本地数据（当前阶段，无后端依赖）
   *   false → 走后端 API（后端就绪后切换）
   */
  useLocalData: true
}

export{
  config
}