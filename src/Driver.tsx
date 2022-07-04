import {Props} from "./interfaces/Props";
import {Xing, makeXingWord} from "./interfaces/Xing";
export const driver = (props: Props) => {
    const updatedDispWordsQty: number = props.dispWordsQty + 1;
    return {...props};
  }
