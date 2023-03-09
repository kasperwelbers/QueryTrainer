import { QueryResult } from "@/types";
import styled from "styled-components";

const StyledDiv = styled.div`
  grid-area: texts;
  height: 100%;
  display: flex;
  flex-direction: column;
  //border: 2px solid #121212;
  padding: 0.5rem 0.5rem 1rem 0.5rem;
  position: relative;
  text-align: center;

  h2 {
    text-align: center;
  }

  .list {
    //border: 1px solid #121212;
    border-radius: 5px;
    padding: 0.5rem;
    margin-bottom: 2rem;
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
    flex-direction: column;
    margin-bottom: 1rem;
    font-style: italic;

    h3 {
      margin: 0.5rem;
    }
    & > div {
      display: flex;
      flex: 1 1 auto;
      & > div {
        flex: 1 1 auto;
      }
    }
  }

  .result {
    width: 100%;
    min-height: 1.5rem;
    flex: 1 1 auto;
    transition: all 0.4s;
    padding: 0.1rem 0.5rem;

    &.match {
      margin-left: 50%;
    }
    &.error {
      margin-left: 25%;
    }
    &.focus div {
      border: 3px solid black;
    }

    div {
      height: 100%;
      width: 50%;
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
      <div className="list">
        <h4>Texts NOT about {label}</h4>
        <p>
          These <i>should NOT</i> be found
        </p>
        <div className="label">
          <div>
            <div>true negative (TN)</div>
            <div>false positive (FP)</div>
          </div>
        </div>
        <Results
          results={notReal}
          invalid={invalid}
          focus={focus}
          setFocus={setFocus}
        />
      </div>
      <div className="list">
        <h4>Texts about {label}</h4>
        <p>
          These <i>should</i> be found
        </p>
        <div className="label">
          <div>
            <div>false negative (FN)</div>
            <div>true positive (TN)</div>
          </div>
        </div>
        <Results
          results={real}
          invalid={invalid}
          focus={focus}
          setFocus={setFocus}
        />
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
        console.log(result);
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
