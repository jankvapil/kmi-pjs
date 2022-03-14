import React, { useState } from 'react'
import Head from 'next/head'
import fs from 'fs-extra'

function Home() {
  const [text, setText] = useState("")
  const [path, setPath] = useState(null)
  const [file, setFile] = useState("")
  const [status, setStatus] = useState("")

  const loadFile = async (e) => {
    if (e.target.files.length < 1) {
      setPath(null)
      return
    }
    const files = e.target.files
    const file = files[0]
    const text = await fs.readFile(file.path, "utf8")
    setPath(file.path)
    setFile(`- ${file.name}`)
    setStatus("")
    setText(text)
  }

  const saveFile = () => {
    if (!path) {
      console.log("neznam cestu")
      return
    } 
    fs.writeFile(path, text, (err) => {
      if (err) {
        alert(err)
      } else {
        setStatus("")
      }
    })
  }

  const onTextChangeHandler = (e) => {
    setText(e.target.value)
    setStatus("*")
  }

  return (
    <React.Fragment>
      <Head>
        <title>Electron Demo {file}{status}</title>
      </Head>
      <div>
        <input type="file" onChange={loadFile} style={{width: '80%'}}/>
        <button onClick={saveFile} style={{float: 'right', width: '20%'}}>Save</button>
        <textarea 
          onChange={onTextChangeHandler} 
          type="text" 
          value={text} 
          rows={25} 
          style={{width: '100%'}}
        />
        <span></span>
      </div>
    </React.Fragment>
  )
}

export default Home
