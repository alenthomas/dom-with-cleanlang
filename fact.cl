include browser-core

url2 = 'http://127.0.0.1:8000/fact?num='

getInputVal = do
  e <- click (getElemId ('submit'))
  let input = getElemId 'factno'
  let val = input.value
  return (String val)

getExternalData = do
  data <- getInputVal
  let link = url2 ++ data
  res <- get link
  return res

do
  res <- getExternalData
  let parent = getElemId 'outer'
  let child = getElemId 'inner'
  parent.removeChild child
  let elenode = document.createElement 'div'
  elenode.setAttribute 'id' 'inner'
  let textnode = document.createTextNode res
  elenode.appendChild textnode
  parent.appendChild elenode

