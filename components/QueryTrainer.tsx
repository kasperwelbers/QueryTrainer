import { Loader } from "@/styled/Styled";
import { QueryResult, TextData, Item } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { highlight, parse, test, filter } from "liqe-quick-fix-copy";
import ResultList from "./ResultList";
import ConfusionMatrix from "./ConfusionMatrix";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .header {
    width: 100%;
    text-align: center;
    background: #121212;
    box-shadow: 0 0 0.5rem 0.1rem #12121288;

    h1 {
      font-size: 3rem;
      color: var(--primary-light);
      margin: 1rem;
    }
    h3 {
      color: white;
      margin-top: 1rem;
    }
  }

  .grid {
    width: 100%;
    margin-top: 1rem;
    display: grid;
    padding: 2rem;
    max-width: 1000px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(2, auto);
    grid-gap: 2rem;
    grid-template-areas:
      "input texts"
      "matrix texts";

    .input {
      max-width: 500px;
      grid-area: input;

      p {
        font-weight: bold;
        text-align: center;
        margin: 0 0 0.5rem 0;
      }
      .query-error {
        text-align: center;
        height: 1.15rem;
        color: crimson;
      }
      textarea {
        font-size: 1.7rem;
        padding: 0.5rem 0.5rem;
        width: 100%;
        border-radius: 0.5rem;
      }
    }
    .measures {
      grid-area: matrix;
    }
  }

  @media screen and (max-width: 800px) {
    .grid {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, auto);
      grid-template-areas:
        "input"
        "texts"
        "matrix";
  } 
`;

export default function QueryTrainer() {
  const [results, setResults] = useState<QueryResult[]>([]);
  const [queryError, setQueryError] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [focus, setFocus] = useState<number>(-1);

  const texts = useQuery({
    queryKey: ["texts"],
    queryFn: () => {
      return fetch("data.json").then((res) => res.json());
    },
  });

  useEffect(() => {
    try {
      const q = parse(query);
      setQueryError("");
    } catch (err) {
      setQueryError("Invalid query");
      return;
    }

    // if (query && query.includes('"')) {
    //   setQueryError("Exact matching is not supported");
    // } else {
    //   setQueryError("");
    // }
    const timer = setTimeout(
      () => setResults(performSearch(query, texts.data)),
      500
    );
    return () => clearTimeout(timer);
  }, [query, texts.data, setResults]);

  if (texts.isLoading) return <Loader active={true} />;
  if (texts.isError) return <div>Something went wrong</div>;
  const label = texts?.data?.label || "";

  return (
    <StyledDiv>
      <div className="header">
        <h1>QueryTrainer</h1>
        <h3>{texts.data.title}</h3>
      </div>
      <div className="grid">
        <ResultList
          results={results}
          label={label}
          invalid={!!queryError}
          focus={focus}
          setFocus={setFocus}
        />
        <div className="input">
          <p>{texts.data.description}</p>
          <textarea value={query} onChange={(e) => setQuery(e.target.value)} />
          <p className="query-error">{queryError}</p>
        </div>
        <ConfusionMatrix results={results} label={label} />
        <div className="validity"></div>
      </div>
    </StyledDiv>
  );
}

function performSearch(query: string, texts: TextData) {
  const results: QueryResult[] = [];
  if (!texts?.items) return results;

  const q = parse(query);

  let i = 0;
  for (const item of texts.items) {
    const result: QueryResult = {
      id: ++i,
      match: false,
      real: item.real !== 0,
      text: item.text,
    };
    const text = item.text;

    try {
      if (query && test(q, { text })) {
        result.match = true;
        //result.highlight = highlight(q, { text }).query;
      }
    } catch (e) {}
    results.push(result);
  }
  return results;
}
