import {Title, useParams} from "solid-start";

type Params = {
  id: string;
}
export default function Article() {
  const params = useParams<Params>();
  return <div>User {params.id}</div>;
}
