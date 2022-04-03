import _ from 'lodash';

export const getAllStatistics = (list, data) => {
  const getStatisticData = ({ first_name, last_name }) => {
    return getStatisticsByName(list, [last_name, first_name].join(', '));
  }

  const data1 = _.map(data?.presidential.list || [], getStatisticData);

  const data2 = _.map(data?.vicepresidential.list || [], getStatisticData);

  return [...data1, ...data2]
};

export const getStatisticsByName = (list, name) => {
  const filteredPresidentialList = _.filter(list, [
    'candidates.presidential.full_name',
    name,
  ]);
  const filteredVicePresidentialList = _.filter(list, [
    'candidates.vicepresidential.full_name',
    name,
  ]);

  const count =
    filteredPresidentialList.length + filteredVicePresidentialList.length;

  const data = {
    name,
    count,
  };

  return data;
};
