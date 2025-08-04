import type React from 'react';
import { Button, Result } from 'antd';

const App: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="抱歉，你没有该页面的访问权限."
    extra={<Button type="primary">Back Home</Button>}
  />
);

export default App;
