import { useMemo } from "react";
import styled from "styled-components";
import { QueryResult } from "@/types";

const StyledDiv = styled.div`
  display: flex;
  flex: 1 1 auto;
  max-width: 500px;
  flex-direction: column;
  //border: 1px solid #121212;
  padding: 2rem 2rem 2rem 0.5rem;
  border-radius: 10px;

  h2 {
    text-align: center;
  }

  .container {
    margin: auto;
  }
  .matrix {
    grid-area: measures;
    padding-top: 0;
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas:
      ". xlab xlab ."
      "ylab negative positive ."
      "notReal tn fp row2"
      "real fn tp row1"
      ". col1 col2 total";
    grid-gap: 0;
    text-align: center;

    div {
      padding-top: 0.3rem;
    }
    .grey {
      background: #f0f0f0;
      padding: 0.5rem;
    }

    .label {
      font-weight: bold;
    }
    .xlab {
      grid-area: xlab;
      font-size: 2rem;
    }
    .ylab {
      font-size: 2rem;
      grid-area: ylab;
    }

    .negative {
      font-style: italic;

      grid-area: negative;
    }
    .positive {
      font-style: italic;

      grid-area: positive;
    }
    .real {
      font-style: italic;

      grid-area: real;
      text-align: right;
    }
    .notReal {
      font-style: italic;

      grid-area: notReal;
      text-align: right;
    }

    .row1 {
      font-weight: bold;
      grid-area: row1;
    }
    .row2 {
      font-weight: bold;
      grid-area: row2;
    }
    .col1 {
      font-weight: bold;
      grid-area: col1;
    }
    .col2 {
      font-weight: bold;
      grid-area: col2;
    }
    .total {
      font-weight: bold;

      grid-area: total;
    }
  }
  .tp {
    border-radius: 5px;
    padding: 0.2rem;
    grid-area: tp;
    background: lightgreen;
  }
  .fp {
    border-radius: 5px;
    padding: 0.2rem;
    grid-area: fp;
    background: #fd9aae;
  }
  .fn {
    border-radius: 5px;
    padding: 0.2rem;
    grid-area: fn;
    background: crimson;
    color: white;
  }
  .tn {
    border-radius: 5px;
    padding: 0.2rem;
    grid-area: tn;
    background: green;
    color: white;
  }

  .calculation {
    line-height: 2.5rem;
    font-family: monospace;
  }
`;

interface Props {
  results: QueryResult[];
  label: string;
}

export default function ConfusionMatrix({ results, label }: Props) {
  const d = useMemo(() => {
    const d: Record<string, number> = { fp: 0, tp: 0, fn: 0, tn: 0 };
    for (let result of results || []) {
      if (result.match && result.real) d.tp++;
      if (result.match && !result.real) d.fp++;
      if (!result.match && result.real) d.fn++;
      if (!result.match && !result.real) d.tn++;
    }

    d.precision = d.tp / (d.tp + d.fp);
    d.recall = d.tp / (d.tp + d.fn);
    d.f1 = (2 * (d.precision * d.recall)) / (d.precision + d.recall);
    return d;
  }, [results]);

  const f = (n: number) => (n ? n.toFixed(2) : 0);

  return (
    <StyledDiv>
      {/* <h2>Precision, Recall and F1</h2> */}
      <div className="container">
        <div className="matrix">
          <div className="xlab label ">Search results</div>
          <div className="negative label grey">negative</div>
          <div className="positive label grey">positive</div>

          <div className="ylab label ">Reality</div>
          <div className="real label grey">about {label}</div>
          <div className="notReal label grey">not about {label}</div>

          <div className="tp ">{d.tp}</div>
          <div className="fp ">{d.fp}</div>
          <div className="fn ">{d.fn}</div>
          <div className="tn ">{d.tn}</div>

          <div className="row1">{d.tp + d.fn}</div>
          <div className="row2">{d.fp + d.tn}</div>
          <div className="col1">{d.tn + d.fn}</div>
          <div className="col2">{d.fp + d.tn}</div>
          <div className="total">{d.tp + d.fn + d.fp + d.tn}</div>
        </div>
        <div className="calculation">
          <br />
          <li>
            Precision: <span className="tp">TP</span>/(
            <span className="tp">TP</span>+<span className="fp">FP</span>) ={" "}
            <span className="tp">{d.tp}</span>/(
            <span className="tp">{d.tp}</span>+
            <span className="fp">{d.fp}</span>) = {f(d.precision)}
          </li>
          <li>
            Recall: &nbsp;&nbsp;&nbsp;<span className="tp">TP</span>/(
            <span className="tp">TP</span>/<span className="fn">FN</span>) ={" "}
            <span className="tp">{d.tp}</span>/(
            <span className="tp">{d.tp}</span>/
            <span className="fn">{d.fn}</span>) = {f(d.recall)}
          </li>
          <li>
            F1: &nbsp; &nbsp; &nbsp; &nbsp;
            {`2*(${f(d.precision)}*${f(d.recall)})/(${f(d.precision)}+${f(
              d.recall
            )}) = ${f(d.f1)}`}
          </li>
        </div>
      </div>
    </StyledDiv>
  );
}
