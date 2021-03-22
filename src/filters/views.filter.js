export default function viewsFilter(value) {
  if (value > 1000000) {
    return (value / 1000000).toFixed() + " мил. просмотров";
  } else if (value > 1000) {
    return (value / 1000).toFixed() + " тыс. просмотров";
  } else {
    return value + " просмотров";
  }
}