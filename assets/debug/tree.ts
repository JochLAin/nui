import "@nui/tree";

const main = document.body.querySelector('main')!;
main.setAttribute('style', 'display: flex;flex-direction: row;width: 100vw;min-height: 100vh;padding: 1rem 2rem;gap: 2rem');

main.innerHTML = `
<nui-tree open style="flex:0 0 15rem;width:15rem">
  Root
  <nui-tree>
    Branche 1
    <nui-tree>
      Branche 1-1
      <nui-tree>
        Branche 1-1-1
      </nui-tree>
      <nui-tree>
        Branche 1-1-2
      </nui-tree>
      <nui-tree>
        Branche 1-1-3
      </nui-tree>
      <nui-tree>
        Branche 1-1-4
      </nui-tree>
    </nui-tree>
    <nui-tree>
      Branche 1-2
      <nui-tree>
        Branche 1-2-1
      </nui-tree>
      <nui-tree>
        Branche 1-2-2
      </nui-tree>
      <nui-tree>
        Branche 1-2-3
      </nui-tree>
    </nui-tree>
    <nui-tree>
      Branche 1-3
    </nui-tree>
    <nui-tree>
      Branche 1-4
    </nui-tree>
  </nui-tree>
  <nui-tree>
    Branche 2
    <nui-tree>
      Branche 2-1
    </nui-tree>
    <nui-tree>
      Branche 2-2
    </nui-tree>
    <nui-tree>
      Branche 2-3
    </nui-tree>
    <nui-tree>
      Branche 2-4
    </nui-tree>
  </nui-tree>
  <nui-tree>
    Branche 3
  </nui-tree>
  <nui-tree>
    Branche 4
  </nui-tree>
  <nui-tree>
    Branche 5
  </nui-tree>
</nui-tree>

<div class="nui-tree--file--toggle" style="flex:0 0 15rem;width:15rem">
  <nui-tree open>
    <span class="fad fa-folder fa-fw"></span>
    <span class="fad fa-folder-open fa-fw"></span>
    &nbsp;Root
    <nui-tree>
      <span class="fad fa-folder fa-fw"></span>
      <span class="fad fa-folder-open fa-fw"></span>
      &nbsp;Branche 1
      <nui-tree>
        <span class="fad fa-folder fa-fw"></span>
        <span class="fad fa-folder-open fa-fw"></span>
        &nbsp;Branche 1-1
        <nui-tree>
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-1-1
        </nui-tree>
        <nui-tree>
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-1-2
        </nui-tree>
        <nui-tree>
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-1-3
        </nui-tree>
        <nui-tree>
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-1-4
        </nui-tree>
      </nui-tree>
      <nui-tree>
        <span class="fad fa-folder fa-fw"></span>
        <span class="fad fa-folder-open fa-fw"></span>
        &nbsp;Branche 1-2
        <nui-tree>
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-2-1
        </nui-tree>
        <nui-tree>
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-2-2
        </nui-tree>
        <nui-tree>
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-2-3
        </nui-tree>
      </nui-tree>
      <nui-tree>
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 1-3
      </nui-tree>
      <nui-tree>
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 1-4
      </nui-tree>
    </nui-tree>
    <nui-tree>
      <span class="fad fa-folder fa-fw"></span>
      <span class="fad fa-folder-open fa-fw"></span>
      &nbsp;Branche 2
      <nui-tree>
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 2-1
      </nui-tree>
      <nui-tree>
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 2-2
      </nui-tree>
      <nui-tree>
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 2-3
      </nui-tree>
      <nui-tree>
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 2-4
      </nui-tree>
    </nui-tree>
    <nui-tree>
      <span class="fad fa-file fa-fw"></span>
      &nbsp;Branche 3
    </nui-tree>
    <nui-tree>
      <span class="fad fa-file fa-fw"></span>
      &nbsp;Branche 4
    </nui-tree>
    <nui-tree>
      <span class="fad fa-file fa-fw"></span>
      &nbsp;Branche 5
    </nui-tree>
  </nui-tree>
</div>



<div class="nui-tree--file" style="flex:0 0 15rem;width:15rem">
  <nui-tree id="root" open>
    <span class="fad fa-folder fa-fw"></span>
    <span class="fad fa-folder-open fa-fw"></span>
    &nbsp;Root
    <nui-tree id="branche-1">
      <span class="fad fa-folder fa-fw"></span>
      <span class="fad fa-folder-open fa-fw"></span>
      &nbsp;Branche 1
      <nui-tree id="branche-1-1">
        <span class="fad fa-folder fa-fw"></span>
        <span class="fad fa-folder-open fa-fw"></span>
        &nbsp;Branche 1-1
        <nui-tree id="branche-1-1-1">
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-1-1
        </nui-tree>
        <nui-tree id="branche-1-1-2">
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-1-2
        </nui-tree>
        <nui-tree id="branche-1-1-3">
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-1-3
        </nui-tree>
        <nui-tree id="branche-1-1-4">
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-1-4
        </nui-tree>
      </nui-tree>
      <nui-tree id="branche-1-2">
        <span class="fad fa-folder fa-fw"></span>
        <span class="fad fa-folder-open fa-fw"></span>
        &nbsp;Branche 1-2
        <nui-tree>
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-2-1
        </nui-tree>
        <nui-tree>
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-2-2
        </nui-tree>
        <nui-tree>
          <span class="fad fa-file fa-fw"></span>
          &nbsp;Branche 1-2-3
        </nui-tree>
      </nui-tree>
      <nui-tree id="branche-1-3">
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 1-3
      </nui-tree>
      <nui-tree id="branche-1-4">
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 1-4
      </nui-tree>
    </nui-tree>
    <nui-tree id="branche-2">
      <span class="fad fa-folder fa-fw"></span>
      <span class="fad fa-folder-open fa-fw"></span>
      &nbsp;Branche 2
      <nui-tree>
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 2-1
      </nui-tree>
      <nui-tree>
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 2-2
      </nui-tree>
      <nui-tree>
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 2-3
      </nui-tree>
      <nui-tree>
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 2-4
      </nui-tree>
    </nui-tree>
    <nui-tree>
      <span class="fad fa-file fa-fw"></span>
      &nbsp;Branche 3
    </nui-tree>
    <nui-tree>
      <span class="fad fa-file fa-fw"></span>
      &nbsp;Branche 4
    </nui-tree>
    <nui-tree>
      <span class="fad fa-file fa-fw"></span>
      &nbsp;Branche 5
    </nui-tree>
  </nui-tree>
</div>
`.replace(/[\n ] +/g, '');
