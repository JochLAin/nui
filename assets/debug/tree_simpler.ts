import "@nui/branch";
import "@nui/tree";

const main = document.body.querySelector('main')!;

main.innerHTML = `
<div class="nui-tree--file">
  <nui-tree id="root" open>
    <span class="fad fa-folder-open fa-fw"></span>
    &nbsp;Root
    <nui-tree id="branche-1" open>
      <span class="fad fa-file fa-fw"></span>
      &nbsp;Branche 1
      <nui-tree id="branche-1-1" open>
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 1.1
      </nui-tree>
      <nui-tree id="branche-1-2" open>
        <span class="fad fa-file fa-fw"></span>
        &nbsp;Branche 1.2
      </nui-tree>
    </nui-tree>
    <nui-tree id="branche-2" open>
      <span class="fad fa-file fa-fw"></span>
      &nbsp;Branche 2
    </nui-tree>
  </nui-tree>
</div>
`.replace(/[\n ] +/g, '');