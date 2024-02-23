import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { svelte, svelteParser } from "../dist/";
import { printTree } from "./print-lezer-tree";
import { oneDark } from '@codemirror/theme-one-dark';
import { syntaxTree } from '@codemirror/language';

const testDoc = `
{#unknown}

{#each foo as foo}
  {#unknown}
{/each}

<svelte:body />

<svelte:window />

<Slider
  bind:value
  min={0}
  --rail-color="black"
  --track-color="rgb(0, 0, 255)"
/>

{#if nesting({ foo: "bar" })} asdf {/if}
{#if foo} asdf {:else if aaggghg} foobar {:else} bar {/if}
{#each asdf.foo({ test: "yes it ignores this as" }) as something} asfd {/each}
{#each asdf as { foo }} asdf {/each}
{#each asdf as { bar }} asdf {/each}
{#each asdf as foo, bar} asdf {/each}
{#each asdf as foo, bar (test)} asdf {/each}

{#if answer === 42}
	<p>what was the question?</p>
{/if}

{#if porridge.temperature > 100}
	<p>too hot!</p>
{:else if 80 > porridge.temperature}
	<p>too cold!</p>
{:else}
	<p>just right!</p>
{/if}

<h1>Shopping list</h1>
<ul>
	{#each items as item}
		<li>{item.name} x {item.qty}</li>
	{/each}
</ul>

{#each items as item, i}
	<li>{i + 1}: {item.name} x {item.qty}</li>
{/each}

{#each items as item (item.id)}
	<li>{item.name} x {item.qty}</li>
{/each}

<!-- or with additional index value -->
{#each items as item, i (item.id)}
	<li>{i + 1}: {item.name} x {item.qty}</li>
{/each}

{#each items as { id, name, qty }, i (id)}
	<li>{i + 1}: {name} x {qty}</li>
{/each}

{#each objects as { id, ...rest }}
	<li><span>{id}</span><MyComponent {...rest}/></li>
{/each}

{#each items as [id, ...rest]}
	<li><span>{id}</span><MyComponent values={rest}/></li>
{/each}

{#each todos as todo}
	<p>{todo.text}</p>
{:else}
	<p>No tasks today!</p>
{/each}

{#await promise}
	<!-- promise is pending -->
	<p>waiting for the promise to resolve...</p>
{:then value}
	<!-- promise was fulfilled -->
	<p>The value is {value}</p>
{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong: {error.message}</p>
{/await}

{#await promise}
	<!-- promise is pending -->
	<p>waiting for the promise to resolve...</p>
{:then value}
	<!-- promise was fulfilled -->
	<p>The value is {value}</p>
{/await}

{#await promise then value}
	<p>The value is {value}</p>
{/await}
{#await promise catch error}
	<p>The error is {error}</p>
{/await}

{#key value}
	<div transition:fade>{value}</div>
{/key}

<div class="blog-post">
	<h1>{post.title}</h1>
	{@html post.content}
</div>

{@debug var}

{@debug var1, var2, var3}

<script>
	export let boxes;
</script>

{#each boxes as box}
	{@const area = box.width * box.height}
	{box.width} * {box.height} = {area}
{/each}`

const svelteTutorialDoc = "<h1>Hello world!</h1>\n\n<h1>Hello {name.toUpperCase()}!</h1>\n\n<img>\n<img {src} alt=\"{name} dances.\">\n\n<p>This is a paragraph.</p>\n\n<p>This is a paragraph.</p>\n\n<p>This is a paragraph.</p>\n<Nested/>\n\n<p>{string}</p>\n\n<p>{@html string}</p>\n\n<button>\n\tClicked {count} {count === 1 ? 'time' : 'times'}\n</button>\n\n<button on:click={incrementCount}>\n\tClicked {count} {count === 1 ? 'time' : 'times'}\n</button>\n\n<button on:click={handleClick}>\n\tClicked {count} {count === 1 ? 'time' : 'times'}\n</button>\n\n\n<button on:click={handleClick}>\n\tClicked {count} {count === 1 ? 'time' : 'times'}\n</button>\n\n<p>{count} doubled is {doubled}</p>\n\n<button on:click={handleClick}>\n\tClicked {count} {count === 1 ? 'time' : 'times'}\n</button>\n\n<p>{numbers.join(' + ')} = {sum}</p>\n\n<button on:click={addNumber}>\n\tAdd a number\n</button>\n\n<p>{numbers.join(' + ')} = {sum}</p>\n\n<button on:click={addNumber}>\n\tAdd a number\n</button>\n\n<Nested answer={42}/>\n\n<p>\n\tThe <code>{name}</code> package is {speed} fast.\n\tDownload version {version} from <a href=\"https://www.npmjs.com/package/{name}\">npm</a>\n\tand <a href={website}>learn more here</a>\n</p>\n\n<Info name={pkg.name} version={pkg.version} speed={pkg.speed} website={pkg.website}/>\n\n<Info {...pkg}/>\n\n<button on:click={toggle}>\n\tLog out\n</button>\n\n<button on:click={toggle}>\n\tLog in\n</button>\n\n{#if user.loggedIn}\n\t<button on:click={toggle}>\n\t\tLog out\n\t</button>\n{/if}\n\n{#if !user.loggedIn}\n\t<button on:click={toggle}>\n\t\tLog in\n\t</button>\n{/if}\n\n{#if user.loggedIn}\n\t<button on:click={toggle}>\n\t\tLog out\n\t</button>\n{:else}\n\t<button on:click={toggle}>\n\t\tLog in\n\t</button>\n{/if}\n\n{#if x > 10}\n\t<p>{x} is greater than 10</p>\n{:else}\n\t{#if 5 > x}\n\t\t<p>{x} is less than 5</p>\n\t{:else}\n\t\t<p>{x} is between 5 and 10</p>\n\t{/if}\n{/if}\n\n{#if x > 10}\n\t<p>{x} is greater than 10</p>\n{:else if 5 > x}\n\t<p>{x} is less than 5</p>\n{:else}\n\t<p>{x} is between 5 and 10</p>\n{/if}\n\n<h1>The Famous Cats of YouTube</h1>\n\n<ul>\n\t<!-- open each block -->\n\t\t<li><a target=\"_blank\" href=\"https://www.youtube.com/watch?v={cat.id}\">\n\t\t\t{cat.name}\n\t\t</a></li>\n\t<!-- close each block -->\n</ul>\n\n<h1>The Famous Cats of YouTube</h1>\n\n<ul>\n\t{#each cats as { id, name }, i}\n\t\t<li><a target=\"_blank\" href=\"https://www.youtube.com/watch?v={id}\">\n\t\t\t{i + 1}: {name}\n\t\t</a></li>\n\t{/each}\n</ul>\n\n<button on:click={handleClick}>\n\tRemove first thing\n</button>\n\n{#each things as thing}\n\t<Thing name={thing.name}/>\n{/each}\n\n<button on:click={handleClick}>\n\tRemove first thing\n</button>\n\n{#each things as thing (thing.id) }\n\t<Thing name={thing.name}/>\n{/each}\n\n<button on:click={handleClick}>\n\tgenerate random number\n</button>\n\n{#await promise}\n\t<p>...waiting</p>\n{:then number}\n\t<p>The number is {number}</p>\n{:catch error}\n\t<p style=\"color: red\">{error.message}</p>\n{/await}\n\n<div on:mousemove={handleMousemove}>\n\tThe mouse position is {m.x} x {m.y}\n</div>\n\n<div on:mousemove=\"{e => m = { x: e.clientX, y: e.clientY }}\">\n\tThe mouse position is {m.x} x {m.y}\n</div>\n\n<div on:mousemove={e => m = { x: e.clientX, y: e.clientY }}>\n\tThe mouse position is {m.x} x {m.y}\n</div>\n\n<button on:click|once={handleClick}>\n\tClick me\n</button>\n\n<button on:click={sayHello}>\n\tClick to say hello\n</button>\n\n<Inner on:message={handleMessage}/>\n\n<Inner on:message/>\n\n<input bind:value={name}>\n\n<h1>Hello {name}!</h1>\n\n<label>\n\t<input type=number bind:value={a} min=0 max=10>\n\t<input type=range bind:value={a} min=0 max=10>\n</label>\n\n<label>\n\t<input type=number bind:value={b} min=0 max=10>\n\t<input type=range bind:value={b} min=0 max=10>\n</label>\n\n<p>{a} + {b} = {a + b}</p>\n\n<label>\n\t<input type=checkbox bind:checked={yes}>\n\tYes! Send me regular email spam\n</label>\n\n{#if yes}\n\t<p>Thank you. We will bombard your inbox and sell your personal details.</p>\n{:else}\n\t<p>You must opt-in to continue. If you're not paying, you're the product.</p>\n{/if}\n\n<button disabled={!yes}>\n\tSubscribe\n</button>\n\n<h2>Size</h2>\n\n<label>\n\t<input type=radio bind:group={scoops} name=\"scoops\" value={1}>\n\tOne scoop\n</label>\n\n<label>\n\t<input type=radio bind:group={scoops} name=\"scoops\" value={2}>\n\tTwo scoops\n</label>\n\n<label>\n\t<input type=radio bind:group={scoops} name=\"scoops\" value={3}>\n\tThree scoops\n</label>\n\n<h2>Flavours</h2>\n\n{#each menu as flavour}\n\t<label>\n\t\t<input type=checkbox bind:group={flavours} name=\"flavours\" value={flavour}>\n\t\t{flavour}\n\t</label>\n{/each}\n\n{#if flavours.length === 0}\n\t<p>Please select at least one flavour</p>\n{:else if flavours.length > scoops}\n\t<p>Can't order more flavours than scoops!</p>\n{:else}\n\t<p>\n\t\tYou ordered {scoops} {scoops === 1 ? 'scoop' : 'scoops'}\n\t\tof {join(flavours)}\n\t</p>\n{/if}\n\n{@html marked(value)}\n\n<textarea bind:value></textarea>\n\n<h2>Insecurity questions</h2>\n\n<form on:submit|preventDefault={handleSubmit}>\n\t<select bind:value={selected} on:change=\"{() => answer = ''}\">\n\t\t{#each questions as question}\n\t\t\t<option value={question}>\n\t\t\t\t{question.text}\n\t\t\t</option>\n\t\t{/each}\n\t</select>\n\n\t<input bind:value={answer}>\n\n\t<button disabled={!answer} type=submit>\n\t\tSubmit\n\t</button>\n</form>\n\n<p>selected question {selected ? selected.id : '[waiting...]'}</p>\n\n<h2>Size</h2>\n\n<label>\n\t<input type=radio bind:group={scoops} value={1}>\n\tOne scoop\n</label>\n\n<label>\n\t<input type=radio bind:group={scoops} value={2}>\n\tTwo scoops\n</label>\n\n<label>\n\t<input type=radio bind:group={scoops} value={3}>\n\tThree scoops\n</label>\n\n<h2>Flavours</h2>\n\n<select multiple bind:value={flavours}>\n\t{#each menu as flavour}\n\t\t<option value={flavour}>\n\t\t\t{flavour}\n\t\t</option>\n\t{/each}\n</select>\n\n{#if flavours.length === 0}\n\t<p>Please select at least one flavour</p>\n{:else if flavours.length > scoops}\n\t<p>Can't order more flavours than scoops!</p>\n{:else}\n\t<p>\n\t\tYou ordered {scoops} {scoops === 1 ? 'scoop' : 'scoops'}\n\t\tof {join(flavours)}\n\t</p>\n{/if}\n\n<div\n\tcontenteditable=\"true\"\n\tbind:innerHTML={html}\n></div>\n\n<pre>{html}</pre>\n\n<h1>Todos</h1>\n\n{#each todos as todo}\n\t<div class:done={todo.done}>\n\t\t<input\n\t\t\ttype=checkbox\n\t\t\tbind:checked={todo.done}\n\t\t>\n\n\t\t<input\n\t\t\tplaceholder=\"What needs to be done?\"\n\t\t\tbind:value={todo.text}\n\t\t>\n\t</div>\n{/each}\n\n<p>{remaining} remaining</p>\n\n<button on:click={add}>\n\tAdd new\n</button>\n\n<button on:click={clear}>\n\tClear completed\n</button>\n\n<h1>Caminandes: Llamigos</h1>\n<p>From <a href=\"https://studio.blender.org/films\">Blender Studio</a>. CC-BY</p>\n\n<div>\n\t<video\n\t\tposter=\"https://sveltejs.github.io/assets/caminandes-llamigos.jpg\"\n\t\tsrc=\"https://sveltejs.github.io/assets/caminandes-llamigos.mp4\"\n\t\ton:mousemove={handleMove}\n\t\ton:touchmove|preventDefault={handleMove}\n\t\ton:mousedown={handleMousedown}\n\t\ton:mouseup={handleMouseup}\n\t\tbind:currentTime={time}\n\t\tbind:duration\n\t\tbind:paused>\n\t\t<track kind=\"captions\">\n\t</video>\n\n\t<div class=\"controls\" style=\"opacity: {duration && showControls ? 1 : 0}\">\n\t\t<progress value=\"{(time / duration) || 0}\"/>\n\n\t\t<div class=\"info\">\n\t\t\t<span class=\"time\">{format(time)}</span>\n\t\t\t<span>click anywhere to {paused ? 'play' : 'pause'} / drag to seek</span>\n\t\t\t<span class=\"time\">{format(duration)}</span>\n\t\t</div>\n\t</div>\n</div>\n\n<input type=range bind:value={size}>\n<input bind:value={text}>\n\n<p>size: {w}px x {h}px</p>\n\n<div bind:clientWidth={w} bind:clientHeight={h}>\n\t<span style=\"font-size: {size}px\">{text}</span>\n</div>\n\n<canvas\n\tbind:this={canvas}\n\twidth={32}\n\theight={32}\n></canvas>\n\n<h1 style=\"color: {pin ? '#333' : '#ccc'}\">{view}</h1>\n\n<Keypad bind:value={pin} on:submit={handleSubmit}/>\n\n<div class=\"keypad\">\n\t<button on:click={select(1)}>1</button>\n\t<button on:click={select(2)}>2</button>\n\t<button on:click={select(3)}>3</button>\n\t<button on:click={select(4)}>4</button>\n\t<button on:click={select(5)}>5</button>\n\t<button on:click={select(6)}>6</button>\n\t<button on:click={select(7)}>7</button>\n\t<button on:click={select(8)}>8</button>\n\t<button on:click={select(9)}>9</button>\n\n\t<button disabled={!value} on:click={clear}>clear</button>\n\t<button on:click={select(0)}>0</button>\n\t<button disabled={!value} on:click={submit}>submit</button>\n</div>\n\n<InputField bind:this={field}/>\n\n<button on:click={() => field.focus()}>Focus field</button>\n\n<input bind:this={input} />\n\n<h1>Photo album</h1>\n\n<div class=\"photos\">\n\t{#each photos as photo}\n\t\t<figure>\n\t\t\t<img src={photo.thumbnailUrl} alt={photo.title}>\n\t\t\t<figcaption>{photo.title}</figcaption>\n\t\t</figure>\n\t{:else}\n\t\t<!-- this block renders when photos.length === 0 -->\n\t\t<p>loading...</p>\n\t{/each}\n</div>\n\n<div>\n\t<button on:click={toggle}>{open ? 'Close' : 'Open'} Timer</button>\n\t<p>\n\t\tThe Timer component has been open for\n\t\t{seconds} {seconds === 1 ? 'second' : 'seconds'}\n\t</p>\n\t{#if open}\n\t<Timer callback={handleTick} />\n\t{/if}\n</div>\n\n<progress value={$progress}></progress>\n\n<button on:click=\"{() => progress.set(0)}\">\n\t0%\n</button>\n\n<button on:click=\"{() => progress.set(0.25)}\">\n\t25%\n</button>\n\n<button on:click=\"{() => progress.set(0.5)}\">\n\t50%\n</button>\n\n<button on:click=\"{() => progress.set(0.75)}\">\n\t75%\n</button>\n\n<button on:click=\"{() => progress.set(1)}\">\n\t100%\n</button>\n\n<div style=\"position: absolute; right: 1em;\">\n\t<label>\n\t\t<h3>stiffness ({coords.stiffness})</h3>\n\t\t<input bind:value={coords.stiffness} type=\"range\" min=\"0\" max=\"1\" step=\"0.01\">\n\t</label>\n\n\t<label>\n\t\t<h3>damping ({coords.damping})</h3>\n\t\t<input bind:value={coords.damping} type=\"range\" min=\"0\" max=\"1\" step=\"0.01\">\n\t</label>\n</div>\n\n<svg\n\ton:mousemove=\"{e => coords.set({ x: e.clientX, y: e.clientY })}\"\n\ton:mousedown=\"{() => size.set(30)}\"\n\ton:mouseup=\"{() => size.set(10)}\"\n>\n\t<circle cx={$coords.x} cy={$coords.y} r={$size}/>\n</svg>\n\n{#if visible}\n\t<p transition:fade>\n\t\tFades in and out\n\t</p>\n{/if}\n\n{#if visible}\n\t<p transition:fly=\"{{ y: 200, duration: 2000 }}\">\n\t\tFlies in and out\n\t</p>\n{/if}\n\n{#if visible}\n\t<p in:fly=\"{{ y: 200, duration: 2000 }}\" out:fade>\n\t\tFlies in, fades out\n\t</p>\n{/if}\n\n<label>\n\t<input type=\"checkbox\" bind:checked={visible}>\n\tvisible\n</label>\n\n{#if visible}\n\t<div class=\"centered\" in:spin=\"{{duration: 8000}}\" out:fade>\n\t\t<span>transitions!</span>\n\t</div>\n{/if}\n\n<p>status: {status}</p>\n\n<label>\n\t<input type=\"checkbox\" bind:checked={visible}>\n\tvisible\n</label>\n\n{#if visible}\n\t<p\n\t\ttransition:fly=\"{{ y: 200, duration: 2000 }}\"\n\t\ton:introstart=\"{() => status = 'intro started'}\"\n\t\ton:outrostart=\"{() => status = 'outro started'}\"\n\t\ton:introend=\"{() => status = 'intro ended'}\"\n\t\ton:outroend=\"{() => status = 'outro ended'}\"\n\t>\n\t\tFlies in and out\n\t</p>\n{/if}\n\n<label>\n\t<input type=\"checkbox\" bind:checked={showItems}>\n\tshow list\n</label>\n\n<label>\n\t<input type=\"range\" bind:value={i} max=10>\n\n</label>\n\n{#if showItems}\n\t{#each items.slice(0, i) as item}\n\t\t<div transition:slide|local>\n\t\t\t{item}\n\t\t</div>\n\t{/each}\n{/if}\n\n<div class='board'>\n\t<input\n\t\tplaceholder=\"what needs to be done?\"\n\t\ton:keydown={e => e.key === 'Enter' && add(e.target)}\n\t>\n\n\t<div class='left'>\n\t\t<h2>todo</h2>\n\t\t{#each todos.filter(t => !t.done) as todo (todo.id)}\n\t\t\t<label\n\t\t\t\tin:receive=\"{{key: todo.id}}\"\n\t\t\t\tout:send=\"{{key: todo.id}}\"\n\t\t\t>\n\t\t\t\t<input type=checkbox on:change={() => mark(todo, true)}>\n\t\t\t\t{todo.description}\n\t\t\t\t<button on:click=\"{() => remove(todo)}\">remove</button>\n\t\t\t</label>\n\t\t{/each}\n\t</div>\n\n\t<div class='right'>\n\t\t<h2>done</h2>\n\t\t{#each todos.filter(t => t.done) as todo (todo.id)}\n\t\t\t<label\n\t\t\t\tclass=\"done\"\n\t\t\t\tin:receive=\"{{key: todo.id}}\"\n\t\t\t\tout:send=\"{{key: todo.id}}\"\n\t\t\t>\n\t\t\t\t<input type=checkbox checked on:change={() => mark(todo, false)}>\n\t\t\t\t{todo.description}\n\t\t\t\t<button on:click=\"{() => remove(todo)}\">remove</button>\n\t\t\t</label>\n\t\t{/each}\n\t</div>\n</div>\n\n<div>\n\tThe number is:\n\t{#key number}\n\t\t<span style=\"display: inline-block\" in:fly={{ y: -20 }}>\n\t\t\t{number}\n\t\t</span>\n\t{/key}\n</div>\n<br />\n<button\n\ton:click={() => {\n\t\tnumber += 1;\n\t}}>\n\tIncrement\n</button>\n\n<div class='board'>\n\t<input\n\t\tplaceholder=\"what needs to be done?\"\n\t\ton:keydown={e => e.key === 'Enter' && add(e.target)}\n\t>\n\n\t<div class='left'>\n\t\t<h2>todo</h2>\n\t\t{#each todos.filter(t => !t.done) as todo (todo.id)}\n\t\t\t<label\n\t\t\t\tin:receive=\"{{key: todo.id}}\"\n\t\t\t\tout:send=\"{{key: todo.id}}\"\n\t\t\t\tanimate:flip\n\t\t\t>\n\t\t\t\t<input type=checkbox on:change={() => mark(todo, true)}>\n\t\t\t\t{todo.description}\n\t\t\t\t<button on:click=\"{() => remove(todo)}\">remove</button>\n\t\t\t</label>\n\t\t{/each}\n\t</div>\n\n\t<div class='right'>\n\t\t<h2>done</h2>\n\t\t{#each todos.filter(t => t.done) as todo (todo.id)}\n\t\t\t<label\n\t\t\t\tclass=\"done\"\n\t\t\t\tin:receive=\"{{key: todo.id}}\"\n\t\t\t\tout:send=\"{{key: todo.id}}\"\n\t\t\t\tanimate:flip\n\t\t\t>\n\t\t\t\t<input type=checkbox checked on:change={() => mark(todo, false)}>\n\t\t\t\t{todo.description}\n\t\t\t\t<button on:click=\"{() => remove(todo)}\">remove</button>\n\t\t\t</label>\n\t\t{/each}\n\t</div>\n</div>\n\n<button on:click={() => (showModal = true)}>Show Modal</button>\n{#if showModal}\n\t<div class=\"box\" use:clickOutside on:outclick={() => (showModal = false)}>\n\t\tClick outside me!\n\t</div>\n{/if}\n\n<label>\n\t<input type=range bind:value={duration} max={2000} step={100}>\n\t{duration}ms\n</label>\n\n<button use:longpress={duration}\n\ton:longpress=\"{() => pressed = true}\"\n\ton:mouseenter=\"{() => pressed = false}\"\n>press and hold</button>\n\n{#if pressed}\n\t<p>congratulations, you pressed and held for {duration}ms</p>\n{/if}\n\n<button\n\tclass:selected=\"{current === 'foo'}\"\n\ton:click=\"{() => current = 'foo'}\"\n>foo</button>\n\n<button\n\tclass:selected=\"{current === 'bar'}\"\n\ton:click=\"{() => current = 'bar'}\"\n>bar</button>\n\n<button\n\tclass:selected=\"{current === 'baz'}\"\n\ton:click=\"{() => current = 'baz'}\"\n>baz</button>\n\n<div class:big>\n\tsome {big ? 'big' : 'small'} text\n</div>\n\n<input type=\"range\" min=\"0\" max=\"1\" step=\"0.1\" bind:value={bgOpacity} />\n\n<p style=\"color: {color}; --opacity: {bgOpacity};\">This is a paragraph.</p>\n\n<input type=\"range\" min=\"0\" max=\"1\" step=\"0.1\" bind:value={bgOpacity} />\n\n<p style:color style:--opacity={bgOpacity}>This is a paragraph.</p>\n\n<Hoverable let:hovering={active}>\n\t<div class:active>\n\t\t{#if active}\n\t\t\t<p>I am being hovered upon.</p>\n\t\t{:else}\n\t\t\t<p>Hover over me!</p>\n\t\t{/if}\n\t</div>\n</Hoverable>\n\n<Hoverable let:hovering={active}>\n\t<div class:active>\n\t\t{#if active}\n\t\t\t<p>I am being hovered upon.</p>\n\t\t{:else}\n\t\t\t<p>Hover over me!</p>\n\t\t{/if}\n\t</div>\n</Hoverable>\n\n<Hoverable let:hovering={active}>\n\t<div class:active>\n\t\t{#if active}\n\t\t\t<p>I am being hovered upon.</p>\n\t\t{:else}\n\t\t\t<p>Hover over me!</p>\n\t\t{/if}\n\t</div>\n</Hoverable>\n\n<select bind:value={selected}>\n\t{#each options as option}\n\t\t<option value={option}>{option}</option>\n\t{/each}\n</select>\n\n<svelte:element this={selected}>I'm a {selected} tag</svelte:element>\n\n<svelte:window on:keydown={handleKeydown}/>\n\n<div style=\"text-align: center\">\n\t{#if key}\n\t\t<kbd>{key === ' ' ? 'Space' : key}</kbd>\n\t\t<p>{code}</p>\n\t{:else}\n\t\t<p>Focus this window and press any key</p>\n\t{/if}\n</div>\n\n<svelte:body\n\ton:mouseenter={handleMouseenter}\n\ton:mouseleave={handleMouseleave}\n/>\n\n<!-- creative commons BY-NC http://www.pngall.com/kitten-png/download/7247 -->\n<img\n\tclass:curious={hereKitty}\n\talt=\"Kitten wants to know what's going on\"\n\tsrc=\"/tutorial/kitten.png\"\n>\n\n<svelte:head>\n\t<link rel=\"stylesheet\" href=\"/tutorial/dark-theme.css\">\n</svelte:head>\n\n<h1>Hello world!</h1>\n\n<input bind:value={user.firstname}>\n<input bind:value={user.lastname}>\n\n{@debug user}\n\n<h1>Hello {user.firstname}!</h1>\n\n{#each confetti as c}\n\t<span style=\"left: {c.x}%; top: {c.y}%; transform: scale({c.r})\">{c.character}</span>\n{/each}"

const doc = testDoc + "\n" + svelteTutorialDoc

const syncAST = EditorView.updateListener.of(update => {
  if (update.docChanged || update.selectionSet) {
    const { from: oldFrom, to: oldTo } = update.startState.selection.ranges[0]
    let { from, to } = update.state.selection.ranges[0]

    const docChanged = update.docChanged
    const selectionChanged =
      !((from === to && oldFrom === oldTo) || (from === oldFrom && to === oldTo))
    const hasSelection = from !== to

    if (docChanged || selectionChanged) {
      const ast = printTree(
        syntaxTree(update.view.state),
        update.state.doc.toString(),
        hasSelection ? { from, to } : undefined
      )
      
      queueMicrotask(() => {
        astView.dispatch({ changes: { from: 0, to: astView.state.doc.length, insert: ast }})
      })
    }
    
  }
})

const mainView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [basicSetup, svelte(), oneDark, EditorView.lineWrapping, syncAST],
  }),
  parent: document.querySelector('#editor'),
});

const astView = new EditorView({
  state: EditorState.create({
    doc: printTree(svelteParser.parse(doc), doc),
    extensions: [basicSetup, oneDark, EditorView.lineWrapping, EditorState.readOnly.of(true)]
  }),
  parent: document.querySelector('#editor-ast')
})