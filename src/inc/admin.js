function confirmDelete(id) {
  let result = confirm("Είστε σίγουρος πως θέλετε να διαγράψετε όλα τα δεδομένα;\n Η ενέργεια αυτή είναι μη αναστρέψιμη!");
  if (result == true) {
      window.location.href='../src/libs/emptyTable.php?id=' + id;
  }
}