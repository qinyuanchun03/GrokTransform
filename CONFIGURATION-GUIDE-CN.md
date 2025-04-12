# Xai API代理配置指南

本指南将帮助您配置CloudFlare Worker以代理Xai API请求，并在本地AI聊天软件中使用自定义域名。

## 部署CloudFlare Worker

1. **准备工作**
   - 确保您已安装[Deno](https://deno.land/)
   - 确保您已安装[Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
   - 拥有CloudFlare账户
   - 拥有一个已连接到CloudFlare的域名

2. **配置wrangler.toml**
   - 打开`wrangler.toml`文件
   - 取消注释并填写您的CloudFlare账户ID和区域ID
   ```toml
   account_id = "您的CloudFlare账户ID"
   zone_id = "您的CloudFlare区域ID"
   ```
   - 取消注释并配置您的自定义域名
   ```toml
   workers_dev = false
   custom_domain = "api-grok.domain.com"  # 替换为您的实际域名
   ```
   - 取消注释并配置路由
   ```toml
   routes = [
     { pattern = "api-grok.domain.com/*", zone_name = "domain.com" }  # 替换为您的实际域名
   ]
   ```

3. **无需设置环境变量**
   - 此代理设计为纯转发功能，不需要在CloudFlare中设置任何环境变量
   - 所有配置（如API密钥和模型选择）都在您的聊天软件中完成

4. **部署Worker**
   ```bash
   deno task deploy
   ```

## 在本地AI聊天软件中配置

根据您的本地AI聊天软件，配置方式可能有所不同。以下是一般配置步骤：

### 基本配置

1. **API地址**：使用您的自定义域名
   ```
   https://api-grok.domain.com
   ```

2. **API密钥**：在聊天软件中设置
   - 在聊天软件中填入您的Xai API密钥
   - 通常在请求头中以`Authorization: Bearer YOUR_API_KEY`的形式发送

3. **模型信息**：在聊天软件中设置
   - 模型名称：可以自由设置，如`grok-1`、`grok-2`等
   - 如果您的聊天软件允许自定义模型参数，可以设置以下参数：
     - 最大上下文长度：131,072 tokens
     - 温度：0.7（可调整）
     - 最大生成长度：4,096 tokens（可调整）

### 高级配置

如果您的聊天软件支持高级配置，您可能需要以下信息：

1. **端点URL**：
   - 聊天完成：`https://api-grok.domain.com/v1/chat/completions`
   - 文本完成：`https://api-grok.domain.com/v1/completions`

2. **请求格式**：
   - 内容类型：`application/json`
   - 请求方法：`POST`
   - 认证方式：`Bearer Token`

3. **请求体示例**（聊天完成）：
   ```json
   {
     "model": "your-model-name",  // 替换为您选择的模型名称
     "messages": [
       {"role": "system", "content": "你是一个有用的AI助手。"},
       {"role": "user", "content": "你好，请介绍一下自己。"}
     ],
     "temperature": 0.7,
     "max_tokens": 1000
   }
   ```

### Chatbox配置示例

如果您使用Chatbox软件，可以按照以下步骤配置：

1. 打开Chatbox，进入设置
2. 点击"新建自定义API提供商"
3. 填写以下信息：
   - 名称：Xai API
   - 基础URL：`https://api-grok.domain.com`
   - API密钥：输入您的Xai API密钥
   - 模型列表：添加您需要的模型，如`grok-1`、`grok-2`等
4. 保存配置
5. 在聊天界面选择Xai API和您添加的模型

## 故障排除

如果您遇到连接问题：

1. **检查API密钥**：确保您的Xai API密钥正确且有效
2. **检查域名配置**：确保您的自定义域名已正确配置并指向CloudFlare
3. **检查Worker日志**：在CloudFlare控制面板中查看Worker日志以获取错误信息
4. **CORS问题**：如果遇到CORS错误，请确保您的聊天软件的域名已添加到允许的源列表中

## 安全注意事项

- API密钥将通过您的代理转发，确保使用HTTPS连接
- 考虑在生产环境中限制CORS来源
- 使用CloudFlare的安全功能，如速率限制和防火墙规则
- 如果多人共享同一个代理，每个用户应使用自己的API密钥
