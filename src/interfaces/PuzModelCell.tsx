export interface PuzModelCell {
  contents: string;
  acrossWord: string;
  downWord: string;
}

export const makePuzModelCell = (
  contents: string,
  acrossWord: string,
  downWord: string
): PuzModelCell => {
  return {
    contents: contents,
    acrossWord: acrossWord,
    downWord: downWord
  };
};

