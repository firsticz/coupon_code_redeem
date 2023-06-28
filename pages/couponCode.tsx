import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { useState } from "react";
import EachTodo from "../components/EachToDo";
import LoaderWave from "../components/LoaderWave";
import { TodoItem } from "../db/models/todoItems";
import tigrisDB from "../lib/tigris";
import styles from "../styles/Home.module.css";

type Props = {
  items: Array<TodoItem>;
};

type FetchStatus = "loading" | "success" | "error";
type TodoViewMode = "list" | "search";

const Home: NextPage<Props> = ({ items }) => {
  const [textInput, setTextInput] = useState("");
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("success");
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [wiggleError, setWiggleError] = useState(false);

  // console.log(todoList);

  const searchQuery = () => {
    console.log('a');
    setTodoList([])
    if (queryCheckWiggle()) {
      return;
    }
    setFetchStatus("loading");

    fetch(`/api/items/search?q=${encodeURI(textInput)}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, 'data');
        setFetchStatus("success");
        if (data.result) {
          console.log(data.result, 'data.result');
          if(data.result.length === 0) {
            alert('code not found')
          } else if(data.result[0].completed === true) {
            alert('used At')
          } else if(data.result[0].completed === false) {
            console.log('u')
            const item = data.result[0]
            item.completed = true;
            item.usedAt = new Date()
            setFetchStatus("loading");

            fetch("/api/item/" + item.id, {
              method: "PUT",
              body: JSON.stringify(item),
            }).then(() => {
              setFetchStatus("success");
              alert('success')
            });
          } else {
            alert('code not found')
          }
          
          // setViewMode("search");
          setTodoList(data.result);
        }
      });
  };

  const setHasError = (hasError: boolean) => {
    setWiggleError(hasError);
    if (hasError) {
      setTimeout(() => {
        setWiggleError(false);
      }, 500);
    }
  };
  
  const queryCheckWiggle = () => {
    const result: RegExpMatchArray | null = textInput.match("^\\S.{0,100}$");
    if (result === null) {
      setHasError(true);
      return true;
    }
    return false;
  };

  return (
    <div>
      <Head>
        <title>Redeem</title>
        <meta name="description" content="Tigris app tutorial" />
      </Head>

      <div className={styles.container}>
        <h2>Redeem</h2>

        {/* Search Header */}
        <div className={styles.searchHeader}>
          <input
            // className={`${styles.searchInput} ${
            //   wiggleError ? styles.invalid : ""
            // }`}
            // value={textInput}
            onChange={(e) => {
              setWiggleError(false);
              setTextInput(e.target.value);
            }}
            placeholder="Type an item to add or search"
          />
          {/* <button onClick={addToDoItem}>Add</button> */}
          <button onClick={searchQuery}>Search</button>
        </div>

        
      </div>
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async () => {
//   const itemsCollection = tigrisDB.getCollection<TodoItem>(TodoItem);
//   const cursor = itemsCollection.findMany();
//   const items = await cursor.toArray();
//   return {
//     props: { items },
//   };
// };

export default Home;
