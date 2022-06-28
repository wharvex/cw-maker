import randomWords from "random-words";
import React from "react";

interface Props {
  bankSize: number;
}

export const WordsMaker = (props: Props) => {
  const getWords = ({ bankSize }: Props): Array<string> => {
    return randomWords(bankSize);
  };

  return (
    <ul>
      {" "}
      {getWords(props).map(word => (
        <li>{word}</li>
      ))}{" "}
    </ul>
  );
};
