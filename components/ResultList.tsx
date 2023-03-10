import { QueryResult } from "@/types";
import styled from "styled-components";

const StyledDiv = styled.div`
  grid-area: texts;
  height: 100%;
  display: grid;
  grid-template-columns: 4rem 1fr;
  grid-template-rows: 6rem 1fr;
  grid-template-areas:
    ". xlab"
    "ylab notReal"
    "ylab real";

  //border: 2px solid #121212;
  padding: 0.5rem 0.5rem 1rem 0.5rem;
  position: relative;
  text-align: center;

  h2 {
    text-align: center;
  }

  .xlab {
    grid-area: xlab;
    height: 2rem;
  }
  .ylab {
    grid-area: ylab;
    writing-mode: vertical-rl;
    transform: rotate(-180deg);
  }

  .axisLabel {
    font-size: 1.8rem;
    font-weight: bold;

    .label {
      font-size: 1.6rem;
      text-decoration: none;
    }
    &.big {
      font-size: 3rem;
    }
    .sublabel {
      font-size: 1.8rem;
      margin-top: 0.5rem;
      display: flex;
      div {
        flex: 1 1 auto;
      }
    }
  }

  .notReal {
    grid-area: notReal;
  }
  .real {
    grid-area: real;
  }

  .list {
    display: grid;
    grid-template-columns: 3rem 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "ylab content";
  }
  .content {
    padding: 0.5rem;
    padding-bottom: 1.5rem;
    grid-area: content;
    position: relative;
    :after {
      content: "";
      display: block;
      border-left: 1px solid #121212;
      top: 0;
      left: calc(50% + 0.25rem);
      height: 100%;
      width: 100%;
      position: absolute;
    }
    &.bottom {
      padding-top: 1rem;
      border-top: 1px solid #121212;
    }
  }
  h4 {
    margin: 0 0 0.3rem 0;
  }
  p {
    margin: 0 0 1rem 0;
    color: #494949;
  }

  .label {
    display: flex;
    margin-bottom: 1rem;
    font-style: italic;

    div {
      width: 50%;
      text-align: center;
    }
  }

  .result {
    width: 100%;
    margin-left: 1%;
    min-height: 1.5rem;
    flex: 1 1 auto;
    transition: all 0.4s;
    padding: 0.1rem 0.5rem;

    &.match {
      margin-left: 51%;
    }
    &.error {
      margin-left: 26%;
    }
    &.focus div {
      border: 3px solid black;
    }

    div {
      height: 100%;
      width: 48%;
      //height: 1.5rem;
      border-radius: 5px;
      border: 3px solid transparent;
      color: white;
      background: #dc143c;
      font-size: 1.2rem;
      //cursor: pointer;
    }

    &.true div {
      color: white;
      background: green;
    }
    &.match div {
      color: black;
      background: #fd9aae;
    }
    &.true.match div {
      color: black;
      background: lightgreen;
    }
    &.error div {
      background: #494949;
    }
  }
`;

interface Props {
  results: QueryResult[];
  label: string;
  invalid?: boolean;
  focus: number;
  setFocus: (focus: number) => void;
}

export default function ResultList({
  results,
  label,
  invalid,
  focus,
  setFocus,
}: Props) {
  if (!results) return null;

  const real = results.filter((r) => r.real);
  const notReal = results.filter((r) => !r.real);

  return (
    <StyledDiv>
      {/* <h2>Search results</h2> */}
      <div className="ylab axisLabel big">Reality</div>
      <div className="xlab axisLabel big" style={{ marginLeft: "3rem" }}>
        Search result
        <div className="sublabel">
          <div>Negative</div>
          <div>Positive</div>
        </div>
      </div>

      <div className="list notReal">
        <div className="ylab axisLabel">NOT about {label}</div>
        <div className="content">
          <div className="label">
            <div>true negative (TN)</div>
            <div>false positive (FP)</div>
          </div>
          <Results
            results={notReal}
            invalid={invalid}
            focus={focus}
            setFocus={setFocus}
          />
        </div>
      </div>

      <div className="list real">
        <div className="ylab axisLabel">About {label}</div>
        <div className="content bottom">
          <div className="label">
            <div>false negative (FN)</div>
            <div>true positive (TP)</div>
          </div>
          <Results
            results={real}
            invalid={invalid}
            focus={focus}
            setFocus={setFocus}
          />
        </div>
      </div>
    </StyledDiv>
  );
}

function Results({
  results,
  invalid,
  focus,
  setFocus,
}: {
  results: QueryResult[];
  invalid?: boolean;
  focus: number;
  setFocus: (focus: number) => void;
}) {
  return (
    <div>
      {results.map((result) => {
        let classname = "result";
        if (invalid) {
          classname += " error";
        } else {
          if (result.match) {
            classname += " match";
            if (result.real) classname += " true";
          } else {
            if (!result.real) classname += " true";
          }
        }
        if (focus === result.id) classname += " focus";

        return (
          <div key={result.id} className={classname}>
            <div onClick={() => setFocus(-1)}>{result.text}</div>
          </div>
        );
      })}
    </div>
  );
}
