import React, { useState } from 'react';
import './App.css';

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const getSpreadsheet = async (sheet_name = 'dice'): Promise<string[]> => {
    return await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheet_name}?key=${API_KEY}`
    )
      .then((res) => res.json())
      .then(({ values }) => {
        return values && values.map((value: Array<string>) => value['0']);
      })
      .then((array) => {
        return array;
      });
  };

  const diceRoll = async (): Promise<void> => {
    // リスト項目をランダムに1つ取得
    const index = Math.floor(Math.random() * list.length);
    setTitle(list[index]);
    if (sheet === 'bingo') setCameout([...cameout, list[index]]);

    // 取得した項目をリストから削除
    let altList: string[] = [...list].filter((item, i) => i !== index);

    // リストが空になったらスプレッドシートから取得
    if (sheet === 'dice' && altList.length < 1)
      altList = await getSpreadsheet('dice');

    setList(altList);
  };

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const sheet_name = event.target.value;
    setSheet(sheet_name);
    setList(await getSpreadsheet(sheet_name));
  };

  const [title, setTitle] = useState('🎉 Bonen Party 🥳');
  const [sheet, setSheet] = useState('');
  const [list, setList] = useState<string[]>([]);
  const [cameout, setCameout] = useState<string[]>([]);

  return (
    <div className="App">
      <div className="container flex min-h-screen flex-col content-center gap-6 py-8">
        <h1 className="grid flex-grow place-content-center text-4xl font-bold leading-relaxed md:text-7xl">
          {title}
        </h1>
        {sheet === 'bingo' && (
          <div className="">
            <h2 className="text-center text-2xl">出たお名前</h2>
            <div className="grid grid-cols-5 gap-4 p-4 text-3xl">
              {cameout.length > 0 &&
                cameout.map((item, i) => <span key={i}>{item}</span>)}
            </div>
          </div>
        )}
        {list.length > 0 && (
          <button
            type="button"
            className="btn-primary btn-lg btn mx-auto w-5/6 max-w-sm text-3xl"
            onClick={() => diceRoll()}>
            何が出るかな 🎲
          </button>
        )}
      </div>
      <div className="mx-auto grid max-w-sm grid-cols-2 place-content-center gap-8 p-4">
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">サイコロトーク</span>
            <input
              type="radio"
              name="list"
              value="dice"
              className="radio-primary radio"
              checked={sheet === 'dice'}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">ビンゴ</span>
            <input
              type="radio"
              name="list"
              value="bingo"
              className="radio-primary radio"
              checked={sheet === 'bingo'}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
