import { A } from 'solid-start'
import { type JSX } from 'solid-js'

export default function Navigation (): JSX.Element {
  return (
    <>
       <A href="/">Index</A>
      <A href="/about">About</A>
    </>
  )
}
