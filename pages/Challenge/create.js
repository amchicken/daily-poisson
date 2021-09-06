import { useForm } from "@lib/useForm";
import { useState } from "react";
import { auth, firestore, serverTimestamp } from "@lib/firebase";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ImageUploader from "@components/ImageUploader";
import Nav from "@components/Nav";

export default function Create() {
  const router = useRouter();
  const [values, onChange] = useForm({
    name: "",
    category: "",
    description: "",
    level: "",
    question: 0,
  });

  const [tags, setTags] = useState([]);
  const [imgURL, setImgURL] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const createCollectionObject = {
      ...values,
      tags: tags,
      thumbnail: imgURL,
      createdBy: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    };
    const ref = firestore.collection("challenges").doc();
    const batch = firestore.batch();

    batch.set(ref, createCollectionObject);

    try {
      await batch.commit();
      toast.success(`Create ${values.name} successful`);
      router.push(`/Challenge/${ref.id}/admin`);
    } catch (err) {
      toast.error(err);
    }
  };

  const goBack = () => {
    router.push("/");
  };

  return (
    <>
      <div className="container2">
        <div className="container2__inside">
          <div className="container2__inside__header">
            <input
              autoComplete="off"
              type="text"
              name="name"
              value={values.name}
              onChange={onChange}
              placeholder="Name This Challenge"
            />
            <p onClick={goBack}>&#10006;</p>
          </div>
          <div className="container2__inside__content">
            <div className="container2__inside__content__1">About</div>
            <div className="container2__inside__content__2">
              <div className="container2__inside__content__2__left">
                <ImageUploader
                  placeholder={"Deck Thumbnail"}
                  setImgURL={setImgURL}
                />
                <div>
                  <input
                    autoComplete="off"
                    type="text"
                    name="category"
                    value={values.category}
                    onChange={onChange}
                    placeholder="Category"
                  />
                </div>
                <div>
                  <input
                    autoComplete="off"
                    type="text"
                    name="level"
                    value={values.level}
                    onChange={onChange}
                    placeholder="Level"
                  />
                </div>
                <span>Description</span>
                <textarea
                  onChange={onChange}
                  name="description"
                  value={values.description}
                  placeholder="Describes something..."
                />
              </div>
              <div className="container2__inside__content__2__right">
                <div className="container2__inside__content__2__right__top">
                  <div>The Creator</div>
                  <Image
                    height="150"
                    width="150"
                    alt="profilepic"
                    src={auth.currentUser.photoURL}
                  />
                  <div>{auth.currentUser.displayName}</div>
                  <div>
                    publish date {new Date().toISOString().split("T")[0]}
                  </div>
                </div>
                <div className="container2__inside__content__2__right__bottom">
                  More from {auth.currentUser.displayName}
                </div>
              </div>
            </div>
          </div>
          <div className="container2__inside__footer">
            <TagsGroup tags={tags} setTags={setTags} />
            <button onClick={onSubmit}>Create Challenges {">>"}</button>
          </div>
        </div>
      </div>
    </>
  );
}

const TagsGroup = ({ tags, setTags }) => {
  const [tag, setTag] = useState("");

  const addTag = () => {
    setTags((old) => [...old, tag]);
    setTag("");
  };

  const removeTags = (idx) => {
    const cp = [...tags];
    cp.splice(idx, 1);
    setTags(cp);
  };

  return (
    <div>
      <Image src="/img/tag.png" width="30" height="30" />
      {tags.map((doc, idx) => (
        <span key={idx}>
          {doc}
          <button onClick={() => removeTags(idx)}>
            <AiOutlineCloseCircle />
          </button>
        </span>
      ))}
      <input
        type="text"
        placeholder="Add Tag"
        onChange={(e) => setTag(e.target.value)}
        value={tag}
      />
      <button onClick={addTag}>+</button>
    </div>
  );
};
