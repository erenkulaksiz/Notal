import { useState } from "react";
import { Container, Loading, Button, Switch } from "@components";
import useAuth from "@hooks/useAuth";

import type { HomeProps } from "./Home.d";

export function Home() {
  const auth = useAuth();
  const [asd, setAsd] = useState(false);

  return (
    <Container>
      {JSON.stringify(auth?.validatedUser)}
      <Switch id="selam" value={asd} onChange={() => setAsd(!asd)} />
    </Container>
  );
}
