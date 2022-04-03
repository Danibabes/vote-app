import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { query, collection, doc, updateDoc, where } from 'firebase/firestore';
import { auth, db, getDocs } from '../auth/firebase';
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

  const handleOnSelectCandidate = async (obj) => {
    setSelectedCandidate({
      ...selectedCandidate,
      candidates: {
        ...selectedCandidate?.candidates,
        [obj.name]: obj.data,
      },
    });
  };

  const handleOnSubmit = async () => {
    console.log('cc-selectedCandidate', selectedCandidate);
    const userId = await getUserId();

    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, { ...selectedCandidate }).then(() => {
      setSelectedCandidate(null);
      window.alert('Thank you for voting!');
      window.location.reload();
    });
  };

  const Card = ({ title, children, ...props }) => {
    return (
      <div className="card rounded border border-blue-500 my-10" {...props}>
        <h1 className="text-white font-semibold text-xl tracking-wide bg-blue-500 px-3 py-2">
          {title}
        </h1>
        <div className="flex flex-wrap p-1">{children}</div>
      </div>
    );
  };

  return (
    <div className="container max-w-4xl px-4 mx-auto">
      {_.map(_.keys(candidates), (name, idx) => {
        const { title, list } = candidates[name];
        return (
          <Card key={idx} title={title}>
            {_.map(list, (data, idx) => (
              <Candidate
                key={idx}
                data={data}
                name={name}
                list={selectedCandidate?.candidates}
                onSelectCandidate={handleOnSelectCandidate}
                className="hover:bg-blue-50 rounded w-1/2 py-2 px-3"
              />
            ))}
          </Card>
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
