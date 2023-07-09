import { useParams } from 'solid-start'
import { type JSX } from 'solid-js'

type Params = {
  id: string
}
export default function Article (): JSX.Element {
  const params = useParams<Params>()
  return <div>User {params.id}</div>
}
