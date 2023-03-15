// загрузка всех клиентов

async function loadClients() {
  const loader = document.querySelector('.loader-container')
  loader.style.display = 'none'
  const response = await fetch('http://localhost:3000/api/clients', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json();
  console.log(data)
  renderSortedArr(data, renderClient)

  filterBtn.forEach(btn => {
    btn.addEventListener('click', function () {
      const arrow = btn.querySelector('.down-arrow')
      columnDir ? arrow.style.transform = 'rotate(0)' : arrow.style.transform = 'rotate(180deg)'
      column = this.dataset.column
      columnDir = !columnDir
      renderSortedArr(data, renderClient)
    })
  })
  search.addEventListener('input', (e) => {
    setTimeout(() => {
      filterData(e.target.value, data, renderClient)
    }, 300)
  })
}

setTimeout(loadClients, 1000)

// сортировка

let column = 'id'
let columnDir = true
const filterBtn = document.querySelectorAll('.filter-btn')

function sortClients(prop, dir, arr) {
  const clientsCopy = [...arr]
  return clientsCopy.sort(function (clientA, clientB) {
    if ((!dir == false ? clientA[prop] < clientB[prop] : clientA[prop] > clientB[prop]))
      return -1;
  })
}

function renderSortedArr(arr, fun) {
  let clientsCopy = [...arr]
  clientsCopy = sortClients(column, columnDir, arr)
  $clientsList.innerHTML = ''

  for (let client of clientsCopy) {
    const dateTime = new Date(client.createdAt)
    const lastChange = new Date(client.updatedAt)
    const formattedDateTime = formatDate(dateTime)
    const formattedLastChange = formatDate(lastChange)
    $clientsList.append(fun(client.id, client.name, client.surname, client.lastName, formattedDateTime, formattedLastChange, client.contacts))
  }
}

// поиск

const search = document.querySelector('.header__input')

function filterData(searchTerm, arr, fun) {
  let result = [];
  let clientsCopy = [...arr]
  clientsCopy.forEach(client => {
    if (client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.surname.toLowerCase().includes(searchTerm.toLowerCase()) || client.lastName.toLowerCase().includes(searchTerm.toLowerCase())) {
      result.push(client)
    }
  })
  $clientsList.innerHTML = ''

  for (let client of result) {
    const dateTime = new Date(client.createdAt)
    const lastChange = new Date(client.updatedAt)
    const formattedDateTime = formatDate(dateTime)
    const formattedLastChange = formatDate(lastChange)
    $clientsList.append(fun(client.id, client.name, client.surname, client.lastName, formattedDateTime, formattedLastChange, client.contacts))
  }
}

// удаление клента

async function deleteClient(id) {
  await fetch(`http://localhost:3000/api/clients/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

async function patchClient(id, name, surname, lastName, contacts) {
  const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: name,
      surname: surname,
      lastName: lastName,
      contacts: contacts,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json();
  if (response.ok) {
    console.log(data)
    return true
  } else {
    return false
  }
}


const $clientsList = document.getElementById('clients__list')
const allModals = document.querySelectorAll('.modal')
const modals = document.querySelector('.modals')
const modalOverlay = document.querySelector('.modal__overlay')

// отрисовка клиентов

function renderClient(id, name, surname, lastName, dateTime, lastChange, contacts) {
  const $clientTR = document.createElement('tr');
  const $idTD = document.createElement('td');
  const $FIOTD = document.createElement('td');
  const $dateTimeTD = document.createElement('td');
  const $lastChangeTD = document.createElement('td');
  const $contactsTD = document.createElement('td');
  const $buttonGroup = document.createElement('td');
  const btnWrapper = document.createElement('div')
  const changeButton = document.createElement('button');
  const deleteButton = document.createElement('button');

  $idTD.classList.add('table__head', 'clients__id')
  $FIOTD.classList.add('clients__text')
  $dateTimeTD.classList.add('clients__text')
  $lastChangeTD.classList.add('clients__text')
  $contactsTD.classList.add('clients__contacts')
  btnWrapper.classList.add('clients__btn-wrap')
  changeButton.classList.add('clients__btn', 'edit-btn', 'btn')
  changeButton.setAttribute('data-path', 'edit')
  deleteButton.classList.add('clients__btn', 'delete-btn', 'btn')
  deleteButton.setAttribute('data-path', 'delete')

  function createContact(contact) {
    const $contactsSpan = document.createElement('span')
    const tooltip = document.createElement('span')
    tooltip.classList.add('tooltip')
    tooltip.innerText = `${contact.type}: ${contact.value}`

    $contactsSpan.classList.add('clients__contact')

    if (contact.type === 'Телефон') {
      $contactsSpan.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7">
            <circle cx="8" cy="8" r="8" fill="#9873FF"/>
            <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
            </g>
            </svg>`
    } else if (contact.type === 'Email') {
      $contactsSpan.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
            </svg>`
    } else if (contact.type === 'Vk') {
      $contactsSpan.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7">
            <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
            </g>
            </svg>`
    } else if (contact.type === 'Facebook') {
      $contactsSpan.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7">
            <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
            </g>
            </svg>`
    } else {
      $contactsSpan.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
            </svg>`
    }

    $contactsSpan.append(tooltip)
    $contactsTD.append($contactsSpan)
  }

  if (contacts.length > 4) {
    const showContactsBtn = document.createElement('span')
    showContactsBtn.classList.add('show-contact-btn')

    for (let i = 0; i <= 3; i++) {
      createContact(contacts[i])
    }
    for (let i = 4; i <= contacts.length - 1; i++) {
      const $contactsSpan = document.createElement('span')
      const tooltip = document.createElement('span')
      tooltip.classList.add('tooltip')
      tooltip.innerText = `${contacts[i].type}: ${contacts[i].value}`

      $contactsSpan.classList.add('clients__contact', 'hide')

      if (contacts[i].type === 'Телефон') {
        $contactsSpan.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.7">
          <circle cx="8" cy="8" r="8" fill="#9873FF"/>
          <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
          </g>
          </svg>`
      } else if (contacts[i].type === 'Email') {
        $contactsSpan.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
          </svg>`
      } else if (contacts[i].type === 'Vk') {
        $contactsSpan.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.7">
          <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
          </g>
          </svg>`
      } else if (contacts[i].type === 'Facebook') {
        $contactsSpan.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.7">
          <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
          </g>
          </svg>`
      } else {
        $contactsSpan.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
          </svg>`
      }

      showContactsBtn.innerHTML = `+${contacts.length - 4}`
      showContactsBtn.addEventListener('click', () => {
        $contactsSpan.classList.remove('hide')
        showContactsBtn.classList.add('hide')
      })

      $contactsSpan.append(tooltip)
      $contactsTD.append($contactsSpan, showContactsBtn)
    }
  } else {
    for (let i = 0; i <= contacts.length - 1; i++) {
      createContact(contacts[i])
    }
  }

  $idTD.textContent = id
  $FIOTD.textContent = surname + ' ' + name + ' ' + lastName
  $dateTimeTD.innerHTML = dateTime
  $lastChangeTD.innerHTML = lastChange
  changeButton.textContent = 'Изменить'
  deleteButton.textContent = 'Удалить'

  $clientsList.append($clientTR)
  $clientTR.append($idTD, $FIOTD, $dateTimeTD, $lastChangeTD, $contactsTD, $buttonGroup)
  $buttonGroup.append(btnWrapper)
  btnWrapper.append(changeButton, deleteButton)

  const modals = document.querySelector('.modals')
  const allModals = document.querySelectorAll('.modal')
  const closeModalBtn = document.querySelectorAll('.close-modal-btn')
  const cancelBtn = document.querySelectorAll('.cancel')

  // показать модалку

  changeButton.addEventListener('click', async (e) => {
    let path = e.currentTarget.getAttribute('data-path')

    hideAllModals(allModals)

    const currentModal = document.querySelector(`[data-target='${path}']`)
    showModal(currentModal, modals, modalOverlay)


    const idEl = document.querySelector('.modal__id')
    const thisTr = e.currentTarget.parentElement.parentElement.parentElement
    const id = thisTr.firstChild.innerText
    const deleteClientBtn = document.querySelector('.delete-client-btn2')
    const saveClientBtn = document.querySelector('.save-patch')

    idEl.innerText = `ID: ${id}`

    const surnameInp = document.getElementById('change-surname')
    const nameInp = document.getElementById('change-name')
    const lastnameInp = document.getElementById('change-lastname')

    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json();
    console.log(data)
    surnameInp.value = data.surname
    nameInp.value = data.name
    lastnameInp.value = data.lastName

    const clientContacts = data.contacts
    if (clientContacts.length !== 0) {
      clientContacts.forEach(contact => {
        addContact(container2, contact.type, contact.value)
      })
    }

    saveClientBtn.addEventListener('click', () => {
      const f = surnameInp.value
      const i = nameInp.value
      const o = lastnameInp.value
      const contactsContainer = document.querySelectorAll('.modal__contacts')
      const contactsArr = []
      if (contactsContainer.length !== 0) {
        contactsContainer.forEach(contact => {
          const contactEl = {}
          contactEl.type = contact.firstChild.value
          contactEl.value = contact.childNodes[1].value
          console.log(contactEl)
          contactsArr.push(contactEl)
        })
      }
      patchClient(id, i, f, o, contactsArr)
      if (patchClient) {
        location.reload()
      } else {
        const errorsArr = data.errors
        errorMessageEl.innerHTML = ''
        if (errorsArr) {
          errorMessageEl.classList.add('visible')
          errorsArr.forEach(error => {
            const errorEl = document.createElement('div')
            errorEl.innerText = error.message
            errorMessageEl.append(errorEl)
          })
        } else {
          errorMessageEl.classList.remove('visible')
          errorMessageEl.innerHTML = ''
        }
      }
    })

    deleteClientBtn.addEventListener('click', () => {
      deleteClient(id)
      thisTr.remove()

      closeModal(allModals, modals, modalOverlay)
    })
  })

  deleteButton.addEventListener('click', (e) => {
    const path = e.currentTarget.getAttribute('data-path')
    const thisTr = e.currentTarget.parentElement.parentElement.parentElement
    const id = thisTr.firstChild.innerText
    const deleteClientBtn = document.querySelector('.delete-client-btn')
    console.log(id)

    hideAllModals(allModals)

    const currentModal = document.querySelector(`[data-target='${path}']`)
    showModal(currentModal, modals, modalOverlay)

    deleteClientBtn.addEventListener('click', () => {
      deleteClient(id)
      thisTr.remove()

      closeModal(allModals, modals, modalOverlay)
    })
  })

  // закрыть модалку

  const modalInputs = document.querySelectorAll('.modal__input')

  closeModalBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(allModals, modals, modalOverlay)

      const modalContacts = document.querySelectorAll('.modal__contacts')
      modalContacts.forEach(contact => {
        contact.parentElement.classList.remove('padding')
        contact.remove()
      })
      modalInputs.forEach(input => { input.value = '' })
    })
  })

  cancelBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(allModals, modals, modalOverlay)

      const modalContacts = document.querySelectorAll('.modal__contacts')
      modalContacts.forEach(contact => {
        contact.parentElement.classList.remove('padding')
        contact.remove()
      })
      modalInputs.forEach(input => { input.value = '' })
    })
  })

  modalOverlay.addEventListener('click', (e) => {
    if (e.target == modalOverlay) {
      closeModal(allModals, modals, modalOverlay)

      const modalContacts = document.querySelectorAll('.modal__contacts')
      modalContacts.forEach(contact => {
        contact.parentElement.classList.remove('padding')
        contact.remove()
      })
      modalInputs.forEach(input => { input.value = '' })
    }
  })

  return $clientTR
}

const addNewClientBtn = document.getElementById('add-btn')

addNewClientBtn.addEventListener('click', (e) => {
  let path = e.currentTarget.getAttribute('data-path')

  hideAllModals(allModals)

  const currentModal = document.querySelector(`[data-target='${path}']`)
  showModal(currentModal, modals, modalOverlay)
})

// добавление контакта

function addContact(container, type = 'Телефон', value = '') {
  const contactsCount = document.querySelectorAll('.modal__contacts').length + 1
  if (contactsCount <= 10) {
    const modalWrap = container
    modalWrap.classList.remove('padding')
    modalWrap.classList.add('padding')
    const contactsGroup = document.createElement('div')
    contactsGroup.classList.add('modal__contacts')
    const select = document.createElement('select')
    select.classList.add('modal__contacts-select')

    const option1 = document.createElement('option')
    const option2 = document.createElement('option')
    const option3 = document.createElement('option')
    const option4 = document.createElement('option')
    const option5 = document.createElement('option')

    const input = document.createElement('input')
    input.classList.add('modal__contacts-input')
    input.placeholder = 'Введите данные контакта'
    input.setAttribute('type', 'tel')

    const cancelInput = document.createElement('button')
    cancelInput.innerHTML = `
      <svg width="16" height="16" viewbox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_121_1083)">
      <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/>
      </g>
      <defs>
      <clippath id="clip0_121_1083">
      <rect width="16" height="16" fill="white"/>
      </clippath>
      </defs>
      </svg>`
    cancelInput.classList.add('cancel-input')

    cancelInput.addEventListener('click', function () {
      this.parentElement.remove()
    })

    const options = [option1, option2, option3, option4, option5]

    option1.value = 'Телефон'
    option2.value = 'Email'
    option3.value = 'Vk'
    option4.value = 'Facebook'
    option5.value = 'Другое'

    option1.innerText = 'Телефон'
    option2.innerText = 'Email'
    option3.innerText = 'Vk'
    option4.innerText = 'Facebook'
    option5.innerText = 'Другое'

    modalWrap.prepend(contactsGroup)
    contactsGroup.append(select, input, cancelInput)
    select.append(option1, option2, option3, option4, option5)

    select.addEventListener('change', function () {
      let selectedValue = select.options[select.selectedIndex].value
      selectedValue = type
      if (selectedValue === 'Телефон') {
        input.setAttribute('type', 'tel')
      } else if (selectedValue === 'Email') {
        input.setAttribute('type', 'email')
      } else {
        input.setAttribute('type', 'text')
      }
    })
    options.forEach(option => {
      if (option.value.includes(type)) {
        option.selected = true
      }
    })
    input.value = value
  }
}

const saveNewCientBtn = document.querySelector('.save-new-client')
const addContactBtn = document.querySelector('.add1')
const addContactBtn2 = document.querySelector('.add2')
const container1 = document.querySelector('.modal__wrap1')
const container2 = document.querySelector('.modal__wrap2')

addContactBtn.addEventListener('click', () => {
  addContact(container1)
})
addContactBtn2.addEventListener('click', () => {
  addContact(container2)
})

// сохранение нового клиента
const errorMessageEl = document.querySelector('.modal__error-message')

saveNewCientBtn.addEventListener('click', async () => {
  const surnameInp = document.getElementById('surname')
  const nameInp = document.getElementById('name')
  const lastnameInp = document.getElementById('lastname')

  const contactsInput = document.querySelectorAll('.modal__contacts-input')
  const CONTACTS = []

  contactsInput.forEach(input => {
    if (input.value.length !== 0) {
      const selectedValue = input.closest('.modal__contacts').querySelector('select').value
      const contact = {}

      if (selectedValue === 'Телефон') {
        contact.type = 'Телефон'
        contact.value = input.value
      } else if (selectedValue === 'Email') {
        contact.type = 'Email'
        contact.value = input.value
      } else if (selectedValue === 'Vk') {
        contact.type = 'Vk'
        contact.value = input.value
      } else if (selectedValue === 'Facebook') {
        contact.type = 'Facebook'
        contact.value = input.value
      } else {
        contact.type = 'Другое'
        contact.value = input.value
      }
      CONTACTS.push(contact)
    }
  })

  const response = await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    body: JSON.stringify({
      name: nameInp.value,
      surname: surnameInp.value,
      lastName: lastnameInp.value,
      contacts: CONTACTS,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json();
  console.log(data)
  if (response.ok) {
    const id = data.id
    const name = data.name
    const surname = data.surname
    const lastName = data.lastName
    const dateTime = new Date(data.createdAt)
    const lastChange = new Date(data.updatedAt)
    const contacts = data.contacts

    const formattedDateTime = formatDate(dateTime)
    const formattedLastChange = formatDate(lastChange)

    renderClient(id, name, surname, lastName, formattedDateTime, formattedLastChange, contacts)

    // чистка инпутов

    const modalContacts = document.querySelectorAll('.modal__contacts')
    const modalInputs = document.querySelectorAll('.modal__input')

    modalContacts.forEach(contact => {
      contact.parentElement.classList.remove('padding')
      contact.remove()
    })
    modalInputs.forEach(input => { input.value = '' })

    // закрытие всех модалок

    closeModal(allModals, modals, modalOverlay)
  } else {
    const errorsArr = data.errors
    errorMessageEl.innerHTML = ''
    if (errorsArr) {
      errorMessageEl.classList.add('visible')
      errorsArr.forEach(error => {
        const errorEl = document.createElement('div')
        errorEl.innerText = error.message
        errorMessageEl.append(errorEl)
      })
    } else {
      errorMessageEl.classList.remove('visible')
      errorMessageEl.innerHTML = ''
    }
  }
})

// форматирование даты

function formatDate(date) {
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
  const year = date.getFullYear()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

  return `${day}.${month}.${year} <span class="time">${hours}:${minutes}</span>`
}

function hideAllModals(modals) {
  modals.forEach(modal => {
    modal.classList.remove('modal--visible')
    modal.style.transform = 'scale(0)'
    modal.style.opacity = '0'
    errorMessageEl.classList.remove('visible')
    errorMessageEl.innerHTML = ''
  })
}

function showModal(currentM, container, overlay) {
  currentM.classList.add('modal--visible')
  setTimeout(() => {
    currentM.style.transform = 'scale(1)'
    currentM.style.opacity = '1'
    overlay.style.opacity = '1'
  }, 300);
  container.style.display = 'block'
}

function closeModal(modals, container, overlay) {
  modals.forEach(modal => {
    modal.style.transform = 'scale(0)'
    modal.style.opacity = '0'
    overlay.style.opacity = '0'
    errorMessageEl.classList.remove('visible')
    errorMessageEl.innerHTML = ''
    setTimeout(() => {
      modal.classList.remove('modal--visible')
    }, 300);
  })
  setTimeout(() => {
    container.style.display = 'none'
  }, 300);
}






