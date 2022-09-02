// 途中
// JSONがおかしくなる：エラー
// エラー時対応

import { SyntheticEvent, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import loginStyle from '../../styles/login.module.css';
import Image from 'next/image';
import layoutStyle from '../../styles/layout.module.css';
import Layout from '../../components/layout';



export default function Login() {
  const [data, setData] = useState({ mail: '', pass: '' });
  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const router = useRouter();

  async function OnCkickHandle(e: SyntheticEvent) {
    e.preventDefault();
    const response: any = await fetch(
      `http://localhost:8000/users?email=${data.mail}&password=${data.pass}`
    );
    const users = await response.json();

    // サイズが１だったらok

    if (users.length === 1) {
      const user = users[0];
      user.logined = true;
      const date = new Date();
      document.cookie = `id=${
        user.id
      }; expires=${date.setDate(
        date.getDate() + 1
      )}; path=/items;`;

      console.log(document.cookie)
      return fetch(`http://localhost:8000/users/${user.id}`, {
        
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
        .then((res) => {
          console.log(res.status);
          return router.push('/items');
        })
        .catch((err) => {
          console.log('エラー');
        });
    } else {
      alert('入力内容の確認をしてください');
    }
  }

  return (
    <>
      <Layout />

      <div className={loginStyle.primary}>
        <form
          className={loginStyle.contactform}
          onSubmit={(e) => OnCkickHandle(e)}
        >
          <h1>ログイン</h1>
          <div>
            <div className={loginStyle.lavel}>
              <label>メールアドレス：</label>
              <input
                className={loginStyle.forminput}
                type="email"
                placeholder="Email"
                name="mail"
                id="email"
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className={loginStyle.lavel}>
              <label>パスワード：</label>
              <input
                className={loginStyle.forminput}
                type="password"
                placeholder="Password"
                name="pass"
                id="password"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <button className={loginStyle.loginbtn}>ログイン</button>
          </div>
        </form>
        <Link href="./create">
          <a className={loginStyle.userregister}>
            ユーザ登録はこちら
          </a>
        </Link>
      </div>
    </>
  );
}
