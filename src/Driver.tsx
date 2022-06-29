import {Props} from "./interfaces/Props";
export const driver = (props: Props) => {
    props.dispWordsQty++;
    return {...props};
  }
