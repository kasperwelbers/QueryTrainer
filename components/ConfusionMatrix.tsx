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
    grid-template-columns: 10rem 1fr 1fr;
    grid-template-rows: auto auto 1fr 1fr;
    grid-template-areas:
      ". xlab xlab"
      "ylab negative positive"
      "notReal tn fp"
      "real fn tp";
    grid-gap: 0;
    text-align: center;

    div {
      display: table-cell;
      vertical-align: middle;
      padding-top: 0.3rem;
    }

    .label {
      padding: 0.5rem;
      align-self: center;
      font-weight: bold;
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

  .outcomes {
    padding-left: 10rem;
  }

  .outcome {
    margin-top: 1rem;
    padding: 1rem;
    text-align: center;
    p,
    h3 {
      margin: 0;
    }

    .measure {
      font-size: 2rem;
      font-weight: bold;
    }
    .calculation {
      line-height: 2.5rem;
      font-family: monospace;
    }
  }

  .cell {
    font-size: 1.5rem;
    padding: 0.5rem;
  }
  .score {
    font-size: 2rem;
    font-weight: bold;
  }
  .celllabel {
    //font-style: italic;
  }
  .help {
    font-size: 1.2rem;
    font-style: italic;
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
          <div className="negative label">negative</div>
          <div className="positive label ">positive</div>

          <div className="real label">
            about <br />
            {label}
          </div>
          <div className="notReal label ">
            NOT about <br />
            {label}
          </div>

          <div className="cell tp ">
            <span className="celllabel">True Positives:</span>
            <br />
            <span className="score">{d.tp}</span>
            <br />
            <span className="help">
              <b>correctly</b>
              <br /> measured as <b>positive</b>
            </span>
          </div>
          <div className="cell fp ">
            <span className="celllabel">False Positives:</span>
            <br />
            <span className="score">{d.fp}</span>
            <br />
            <span className="help">
              <b>incorrectly</b>
              <br />
              measured as <b>positive</b>
            </span>
          </div>
          <div className="cell fn ">
            <span className="celllabel">False Negatives:</span>
            <br />
            <span className="score">{d.fn}</span>
            <br />
            <span className="help">
              <b>incorrectly</b> <br />
              measured as <b>negative</b>
            </span>
          </div>
          <div className="cell tn ">
            <span className="celllabel">True Negatives:</span>
            <br />
            <span className="score">{d.tn}</span>
            <br />
            <span className="help">
              <b>correctly</b> <br />
              measured as <b>negative</b>
            </span>
          </div>
        </div>
        <br />
        <div className="outcomes">
          <div className="outcome">
            <span className="measure">Precision</span>
            <div className="calculation">
              <span className="tp">TP</span>/(
              <span className="tp">TP</span>+<span className="fp">FP</span>) ={" "}
              <span className="tp">{d.tp}</span>/(
              <span className="tp">{d.tp}</span>+
              <span className="fp">{d.fp}</span>) = {f(d.precision)}
            </div>
          </div>
          <div className="outcome">
            <span className="measure">Recall</span>
            <div className="calculation">
              <span className="tp">TP</span>/(
              <span className="tp">TP</span>+<span className="fn">FN</span>) ={" "}
              <span className="tp">{d.tp}</span>/(
              <span className="tp">{d.tp}</span>+
              <span className="fn">{d.fn}</span>) = {f(d.recall)}
            </div>
          </div>
          <div className="outcome">
            <span className="measure">F1</span>
            <div className="calculation">
              {`2*(${f(d.precision)}*${f(d.recall)})/(${f(d.precision)}+${f(
                d.recall
              )}) = ${f(d.f1)}`}
            </div>
          </div>
        </div>
      </div>
    </StyledDiv>
  );
}
