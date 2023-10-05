import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Network, Url, multipartConfig } from 'src/configs'
import { useLoader } from 'src/hooks'

const SearchResult = () => {
  const router = useRouter()
  const { setLoader } = useLoader()
  const getData = async () => {
    setLoader(true)
    const response = await Network.get(Url.search, router.query?.data, (await multipartConfig()).headers)
    setLoader(false)
    console.log({ response })
  }

  useEffect(() => {
    getData()
  }, [])

  return <div>Search Result Page</div>
}

SearchResult.acl = {
  subject: 'search-result',
  action: 'read'
}

export default SearchResult
