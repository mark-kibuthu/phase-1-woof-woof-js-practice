document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const goodDogFilter = document.getElementById('good-dog-filter');
    let filterOn = false;
    
    // Function to fetch all pups from the API
    const fetchPups = async () => {
      const response = await fetch('http://localhost:3000/pups');
      const pups = await response.json();
      return pups;
    };
  
    // Function to render pups in the dog bar
    const renderPups = async () => {
      const pups = await fetchPups();
      dogBar.innerHTML = ''; // Clear existing dog bar
      
      pups.forEach(pup => {
        // Only add pup to dog bar if filter is off or pup is good
        if (!filterOn || pup.isGoodDog) {
          // Create a span element for each pup in the dog bar
          const dogSpan = document.createElement('span');
          dogSpan.textContent = pup.name;
          dogSpan.addEventListener('click', () => {
            renderDogInfo(pup);
          });
          
          dogBar.appendChild(dogSpan);
        }
      });
    };
  
    // Function to render dog info in the dog info section
    const renderDogInfo = (dog) => {
      dogInfo.innerHTML = ''; // Clear existing dog info
      
      const dogImg = document.createElement('img');
      dogImg.src = dog.image;
      
      const dogName = document.createElement('h2');
      dogName.textContent = dog.name;
      
      const dogBtn = document.createElement('button');
      dogBtn.textContent = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
      dogBtn.addEventListener('click', async () => {
        // Toggle isGoodDog status
        dog.isGoodDog = !dog.isGoodDog;
        dogBtn.textContent = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
        
        // Update database with PATCH request
        await fetch(`http://localhost:3000/pups/${dog.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ isGoodDog: dog.isGoodDog })
        });
      });
      
      dogInfo.appendChild(dogImg);
      dogInfo.appendChild(dogName);
      dogInfo.appendChild(dogBtn);
    };
  
    // Event listener for filter good dogs button
    goodDogFilter.addEventListener('click', async () => {
      filterOn = !filterOn;
      goodDogFilter.textContent = filterOn ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
      await renderPups();
    });
  
    // Initial render of pups when page loads
    renderPups();
  });
  