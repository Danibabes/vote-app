import React, { useState } from 'react';
import { query, collection, addDoc, getDocs, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../auth/firebase';
import _ from 'lodash';

// Components
import Candidate from './Candidate';

// JSON
import candidates from '../candidates.json';

const Ballot = () => {
  const [user] = useAuthState(auth);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const getUserId = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
      const doc = await getDocs(q);
      return doc.docs[0].id;
    } catch (err) {
      return null;
    }
  };

  const handleOnSelectCandidate = async (data) => {
    setSelectedCandidate({
      ...selectedCandidate,
      candidates: {
        ...selectedCandidate?.candidates,
        [`${data.name}_id`]: data.id,
      },
      user_id: await getUserId(),
    });
  };

  const handleOnSubmit = async () => {
    await addDoc(collection(db, 'votelist'), selectedCandidate).then(() => {
      setSelectedCandidate(null);
      window.alert('Thank you for voting!');
      window.location.reload();
    });
  };

  const Card = ({ title, list, name, onSelectCandidate, ...props }) => {
    return (
      <div className="card rounded border border-blue-500 my-10" {...props}>
        <h1 className="text-white font-semibold text-xl tracking-wide bg-blue-500 px-3 py-2">
          {title}
        </h1>
        <div className="flex flex-wrap p-1">
          {_.map(list, (data, idx) => (
            <Candidate
              key={idx}
              data={data}
              name={name}
              list={selectedCandidate?.candidates}
              onSelectCandidate={onSelectCandidate}
              className="hover:bg-blue-50 rounded w-1/2 py-2 px-3"
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container max-w-4xl px-4 mx-auto">
      {_.map(_.keys(candidates), (name, idx) => {
        const { title, list } = candidates[name];
        return (
          <Card
            key={idx}
            title={title}
            list={list}
            name={name}
            onSelectCandidate={handleOnSelectCandidate}
          />
        );
      })}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md text-1xl font-medium hover:bg-blue-700 transition duration-300"
        onClick={handleOnSubmit}
        disabled={!selectedCandidate}
      >
        Submit
      </button>
    </div>
  );
};

export default Ballot;
