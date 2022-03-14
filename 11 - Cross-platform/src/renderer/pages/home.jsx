import React, { useState } from 'react'
import Head from 'next/head'
import fs from 'fs-extra'

function Home() {
  const [text, setText] = useState("")
  
  const loadFile = async (e) => {
    const files = e.target.files
    const file = files[0]
    const text = await fs.readFile(file.path, "utf8")
    setText(text)
  }
  return (
    <React.Fragment>
      <Head>
        <title>Electron Demo</title>
      </Head>
      <div>
        <h1>Notepad</h1>
        <input type="file" onChange={loadFile} style={{width: '100%'}}/>
        <textarea type="text" value={text} rows={25} style={{width: '100%'}}/>
      </div>
    </React.Fragment>
  )
}

export default Home
