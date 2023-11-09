import Image from "next/image";
import getBase64 from "@/lib/getLocalBase64";

type FrameProps = {
  imageUrl: string;
};

export default async function Frame({ imageUrl }: FrameProps) {
  // const bluredImage = await getBase64(imageUrl);
  // return (
  //   <Image
  //     src={imageUrl}
  //     alt="Frame"
  //     width={320}
  //     height={320}
  //     //   placeholder="blur"
  //     //   blurDataURL={bluredImage}
  //     // layout="responsive"
  //     className="rounded-xl border-2 border-purple-300"
  //   />
  // );
}
