import React from 'react';

function OwnerHeirSwitch() {
  return <div align="center">
    <form>
      <label for="owner">Owner  </label>
      <input type="radio" id="owner" value="owner"/>
      <label for="heir">Heir</label>
      <input type="radio" id="heir" value="heir"/>
    </form>
  </div>
}

export default OwnerHeirSwitch;