import _ from 'lodash';

export const getAllStatistics = (list, data) => {
  return _.map(data?.presidential.list || [], (dd) => {
    const name = [dd.last_name, dd.first_name].join(', ');
    return getStatisticsByName(list, name);
  });
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
