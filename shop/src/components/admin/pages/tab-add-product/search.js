import React, {useState} from 'react'
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function Search() {
    const [inputSearch, setInputSearch] = useState('');
    return (
        <div style={{ textAlign: "right" }}>
            <Input placeholder="Search"
                value={inputSearch}
                onChange={e => setInputSearch(e.target.value)}
                style={{ width: 250 }}
                prefix={<SearchOutlined />} />
            <Button icon={<SearchOutlined />} style={{ marginLeft: 3 }} />
        </div>
    )
}

export default Search
