import Head from "next/head";
import styled from "styled-components";
import QueryTrainer from "@/components/QueryTrainer";

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh;
  width: 100vw;
`;

export default function Home() {
  return (
    <>
      <Head>
        <title>QueryTrainer</title>
        <meta
          name="description"
          content="Train your query skills and learn a bit about precision and recall"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StyledMain>
        <QueryTrainer />
      </StyledMain>
    </>
  );
}
