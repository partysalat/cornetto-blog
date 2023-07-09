import { Title } from 'solid-start'
import Counter from '~/components/Counter'
import { type JSX } from 'solid-js'

export default function Home (): JSX.Element {
  return (
    <main>
      <Title>Cornetto Cloud</Title>
      <h1>Hello world!</h1>
      <Counter />
      <p>
        Visit{' '}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{' '}
        to learn how to build SolidStart apps.
      </p>
    </main>
  )
}
