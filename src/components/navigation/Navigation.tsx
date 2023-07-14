import { A } from 'solid-start'
import { type JSX } from 'solid-js'

export default function Navigation (): JSX.Element {
  return (
    <div class="px-2">
       <A href="/">Index</A>
      <A href="/about">About</A>
    </div>
  )
}
