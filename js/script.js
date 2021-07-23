const inputField = document.querySelector(".input-field");
const repositories = document.querySelectorAll(".add-repository");
const repositoryList = document.querySelector(".repositories-list");
const repositoriesInfo = document.querySelector(".repositories-added-list");
const debauncedFn = debounce(addListRepositories, 500);

function debounce(fn, debounceTime) {
  let timeout;

  return function () {
    const funCall = () => {
      fn.apply(this, arguments);
    };

    clearTimeout(timeout);

    timeout = setTimeout(funCall, debounceTime);
  };
}

function creareRepositoriyInfo(btn) {
  const infoBlock = document.createElement("div");
  infoBlock.classList.add("added-repository");

  const infoWrapper = document.createElement("div");

  const repositoryName = document.createElement("p");
  repositoryName.textContent = `Name: ${btn.dataset.name}`;
  infoWrapper.append(repositoryName);

  const repositoryOwner = document.createElement("p");
  repositoryOwner.textContent = `Owner: ${btn.dataset.owner}`;
  infoWrapper.append(repositoryOwner);

  const repositoryStars = document.createElement("p");
  repositoryStars.textContent = `Stars: ${btn.dataset.stars}`;
  infoWrapper.append(repositoryStars);

  const close = document.createElement("button");
  close.classList.add("close");
  close.type = "button";

  infoBlock.append(infoWrapper);
  infoBlock.append(close);

  const fragment = new DocumentFragment();
  fragment.append(infoBlock);

  repositoriesInfo.append(fragment);
}

async function sendRequest(stringRequest) {
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${stringRequest}&sort=stars&per_page=5`
  );

  if (response.ok) {
    let result = await response.json();

    return result.items;
  }
}

async function addListRepositories(userRequest) {
	if (!userRequest) {
		return;
	}

  const result = await sendRequest(userRequest);

  repositoryList.classList.remove("repositories-list__hidden");

  result.forEach((repo, i) => {
    repositories[i].textContent = repo.name;
    repositories[i].dataset.name = repo.name;
    repositories[i].dataset.owner = repo.owner.login;
    repositories[i].dataset.stars = repo.stargazers_count;
  });
}

inputField.addEventListener("input", function (e) {
  inputField.dataset.value = e.target.value;

	debauncedFn(e.target.value);

  if (e.target.value === "") {
    repositoryList.classList.add("repositories-list__hidden");
  }
});

repositoryList.addEventListener("click", function (e) {
	creareRepositoriyInfo(e.target);

	inputField.value = "";

	repositoryList.classList.add("repositories-list__hidden");
});

repositoriesInfo.addEventListener("click", function (e) {
	if (e.target.type === "button") {
		e.target.parentElement.remove();
  }
});
