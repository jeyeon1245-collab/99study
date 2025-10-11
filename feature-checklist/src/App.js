import React, { useState } from 'react';

const headers = [
  '검토 넘버', '검토 측면', '검토 세부', '검토 차수', '검토일', '동구분', '층', '부재구분',
  '위치', '내용', '모델링 기준', '상태', '진행중', '이슈총량', '진행내용', '객체ID'
];

function InputForm({ onAdd }) {
  const [formData, setFormData] = useState(headers.reduce((acc, h) => ({ ...acc, [h]: '' }), {}));

  const handleChange = (e, header) => {
    setFormData({ ...formData, [header]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData(headers.reduce((acc, h) => ({ ...acc, [h]: '' }), {}));
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginRight: 20,
        flex: 1,
        maxWidth: 300
        // overflowY: 'auto', // 스크롤 제거, 주석처리
      }}
    >
      <h2 style={{ marginBottom: 20 }}>데이터 입력</h2>
      {headers.map((header) => (
        <div key={header} style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>{header}</label>
          <input
            type="text"
            value={formData[header]}
            onChange={(e) => handleChange(e, header)}
            style={{ width: '100%' }}
          />
        </div>
      ))}
      <button type="submit" style={{ marginTop: 10, width: '100%' }}>
        행 추가
      </button>
    </form>
  );
}

function DataTable({ rows, onRemove }) {
  return (
    <div style={{ flex: 2, overflowX: 'auto' }}>
      <h2 style={{ marginBottom: 20 }}>검토리스트</h2>
      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {headers.map((header) => (
                <td key={header}>{row[header]}</td>
              ))}
              <td>
                <button onClick={() => onRemove(idx)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DataInputContainer() {
  const [rows, setRows] = useState([]);

  const addRow = (data) => {
    setRows([...rows, data]);
  };

  const removeRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  return (
    <div style={{ display: 'flex', padding: 20, alignItems: 'flex-start' }}>
      <InputForm onAdd={addRow} />
      <DataTable rows={rows} onRemove={removeRow} />
    </div>
  );
}

export default DataInputContainer;
